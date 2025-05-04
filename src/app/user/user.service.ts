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

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(DeletedUser.name)
    private deletedUserModel: Model<DeletedUserDocument>
  ) {}

  async sendPushNotification(expoPushToken: string, name: string) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: `${name} is watching you`,
      body: 'Prove that you are the best Ninja!',
      data: { },
    };

    const x = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    }).then(res => res.json()).then(data => console.log(data));
  }

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

  async getUserById(id: MongooSchema.Types.ObjectId) {
    const currentUser = await this.userModel.findById(id)
      .populate('friends', '-__v') // Populate friends with user data, excluding the __v field
      .exec();
    
    if (!currentUser) {
      throw new Error('user_not_found');
    }
    
    const userRank =
      (await this.userModel.countDocuments({
        score: { $gt: currentUser.score },
      })) + 1;
    currentUser.rank = userRank;
    return currentUser;
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

  async getUserLeaderboard(limit: number, user: User) {
    const users = await this.userModel.find()
      .populate('friends', '-__v')
      .sort({ score: -1 })
      .limit(limit);

    const currentUser = await this.userModel.findOne(
      { _id: user.id },
      { score: 1 },
    );
    const userRank =
      (await this.userModel.countDocuments({
        score: { $gt: currentUser.score },
      })) + 1;

    return {
      users,
      currentUserRank: userRank,
    };
  }

  async findAllUsers(searchTerm?: string, currentUserId?: MongooSchema.Types.ObjectId) {
    let query: any = {};
    // Exclude the current user and their friends from results if currentUserId is provided
    if (currentUserId) {
      const currentUser = await this.userModel.findById(currentUserId);
      if (currentUser) {
        // Exclude both the current user and their friends
        const excludeIds = [currentUserId, ...(currentUser.friends || [])];
        
        query._id = { $nin: excludeIds };
      }
    }
    
    if (searchTerm && searchTerm.length >= 3) {
      // Simple case-insensitive regex search
      const escapedSearchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      
      query.$or = [
        { name: { $regex: escapedSearchTerm, $options: 'i' } },
        { email: { $regex: escapedSearchTerm, $options: 'i' } }
      ];
    }
    
    return this.userModel.find(query).populate('friends', '-__v').sort({ name: 1 });
  }

  async addFriend(userId: MongooSchema.Types.ObjectId, myName: string, friendId: MongooSchema.Types.ObjectId): Promise<User> {
    // Check if friend exists
    const friendExists = await this.userModel.findById(friendId);
    if (!friendExists) {
      throw new Error('friend_not_found');
    }
    
    // Send push notification if friend has fcmToken
    if (friendExists.fcmToken) {
      await this.sendPushNotification(friendExists.fcmToken, myName);
    }

    // Check if already friends (to avoid duplicates)
    const user = await this.userModel.findById(userId);
    if (user.friends && user.friends.some(id => id.toString() === friendId.toString())) {
      // Return user with populated friends
      return this.userModel.findById(userId).populate('friends', '-__v').exec();
    }

    // Add friend to user's friends list
    await this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: friendId } }, // Using $addToSet to avoid duplicates
      { new: true }
    );
    
    // Return the updated user with populated friends
    return this.userModel.findById(userId).populate('friends', '-__v').exec();
  }
}
