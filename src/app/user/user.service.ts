import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooSchema } from 'mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User, UserDocument } from './entities/user.entity';
import { PaginationArgs } from '../common/dto/get-paginated.args';
import { PaginationService } from '../common/pagination.service';
import { DeletedUser, DeletedUserDocument } from './entities/deletedUser.entity';
import { Follower, FollowerDocument } from '../follower/entities/follower.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(DeletedUser.name)
    private deletedUserModel: Model<DeletedUserDocument>,
    @InjectModel(Follower.name)
    private followerModel: Model<FollowerDocument>,
    private readonly paginationService: PaginationService,
  ) {}

  async createUser(createUserInput: CreateUserInput) {
    const createdUser = new this.userModel(createUserInput);

    return createdUser.save();
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findOneBy(externalId: string) {
    return this.userModel.findOne({
      externalId,
    });
  }

  async getUserById(id: MongooSchema.Types.ObjectId, currentUserId?: MongooSchema.Types.ObjectId) {
    const user = await this.userModel.findById(id)
    
    if (!user) {
      throw new Error('user_not_found');
    }
    
    const userRank =
      (await this.userModel.countDocuments({
        score: { $gt: user.score },
      })) + 1;
      user.rank = userRank;

    const followDocs = await this.followerModel.find({
      follower: currentUserId,
      following: { $in: id }
    }).select('following');

    const followingIds = new Set(followDocs.map(f => f.following.toString()));
    
    user.isFollowing = followingIds.has(user._id.toString());
   
    return user;
  }

  updateUser(
    id: MongooSchema.Types.ObjectId,
    updateUserInput: UpdateUserInput,
  ) {
    return this.userModel.findByIdAndUpdate(id, updateUserInput, { new: true });
  }

  async remove(id: MongooSchema.Types.ObjectId) {
    const user = await this.userModel.findById(id).lean();

    if (!user) {
      throw new Error('user_not_found');
    }

    // Insert the user data into the deletedUsers collection
    await this.deletedUserModel.create(user);

    // Delete the user from the users collection
    return await this.userModel.deleteOne({ _id: id });
  }

  async getUserLeaderboard(pagination: PaginationArgs, limit: number, user: User) {
    const users = await this.userModel.find()
      .sort({ score: -1 })
      .limit(limit);

    const paginatedUsers = await this.paginationService.paginate(users as unknown as { _id: any }[], pagination);

    const currentUser = await this.userModel.findOne(
      { _id: user.id },
      { score: 1 },
    );
    const userRank =
      (await this.userModel.countDocuments({
        score: { $gt: currentUser.score },
      })) + 1;

    return {
      users: paginatedUsers,
      currentUserRank: userRank,
    };
  }

  async getUserLocalLeaderboard(pagination: PaginationArgs, limit: number, user: User) {
    const followings = await this.followerModel
      .find({ follower: user.id, deleted_at: { $eq: null } })
      .populate('following')
      .exec();

      let result = followings.map((f) => f.following);
      // shit doesn't work if score is null
      result.sort((a, b) => b?.score - a?.score);
      result = result.filter((u) => u !== null);
      
    const paginatedUsers = await this.paginationService.paginate(result as unknown as { _id: any }[], pagination);

    const currentUser = await this.userModel.findOne(
      { _id: user.id },
      { score: 1 },
    );
    const userRank =
      (await this.userModel.countDocuments({
        score: { $gt: currentUser.score },
      })) + 1;

    return {
      users: paginatedUsers,
      currentUserRank: userRank,
    };
  }

  async findAllUsers(pagination: PaginationArgs, searchTerm?: string, currentUserId?: MongooSchema.Types.ObjectId) {
    let query: any = {};
    
    if (searchTerm && searchTerm.length >= 3) {
      // Simple case-insensitive regex search
      const escapedSearchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      
      query.$or = [
        { name: { $regex: escapedSearchTerm, $options: 'i' } },
        { email: { $regex: escapedSearchTerm, $options: 'i' } }
      ];
    }
    
    const users =  await this.userModel.find(query)
    .sort({ name: 1 })

    const followDocs = await this.followerModel.find({
      follower: currentUserId,
      following: { $in: users.map(u => u._id) }
    }).select('following');

    const followingIds = new Set(followDocs.map(f => f.following.toString()));


    users.forEach((user: any) => {
      user.isFollowing = followingIds.has(user._id.toString());
    });

    return await this.paginationService.paginate(users as unknown as { _id: any }[], pagination);
  }
}
