import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooSchema } from 'mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User, UserDocument } from './entities/user.entity';
import { PaginationArgs } from '../common/dto/get-paginated.args';
import { PaginationService } from '../common/pagination.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
    private readonly paginationService: PaginationService,
  ) {}

  async createUser(createUserInput: CreateUserInput) {
    const createdUser = new this.userModel(createUserInput);

    return createdUser.save();
  }

  findAll() {
    // To implement later
    return this.userModel.find().skip(0).limit(10);
  }

  async findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findOneBy(externalId: string, externalType: string) {
    return this.userModel.findOne({
      externalId, externalType
    })
  }

  getUserById(id: MongooSchema.Types.ObjectId) {
    return this.userModel.findById(id);
  }

  updateUser(
    id: MongooSchema.Types.ObjectId,
    updateUserInput: UpdateUserInput,
  ) {
    return this.userModel.findByIdAndUpdate(id, updateUserInput, { new: true });
  }

  remove(id: MongooSchema.Types.ObjectId) {
    return this.userModel.deleteOne({ id: id });
  }

  async getUserLeaderboard(limit: number, user: User) {
    const users = await this.userModel.find().sort({ score: -1 }).limit(limit);

    const currentUser = await this.userModel.findOne({ _id: user.id }, { score: 1 });
    const userRank = await this.userModel.countDocuments({ score: { $gt: currentUser.score } }) + 1;

    return {
      users,
      currentUserRank: userRank,
    };
  }
}
