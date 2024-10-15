import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { Schema as MongooSchema } from 'mongoose';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.gards';
import { UseGuards } from '@nestjs/common';
import { GetUser } from '../shared/decorators/current-user.decorator';
import { LeaderboardResponse } from './dto/leaderboard-response';
import { DeleteResponse } from './dto/delete-response';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { UploadService } from '../shared/services/upload.service';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService
  ) {}

  // @Mutation(() => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.userService.createUser(createUserInput);
  // }

  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User, {})
  getUserById(
    @Args('id', { type: () => ID }) id: MongooSchema.Types.ObjectId,
  ) {
    return this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User, {})
  getCurrentUser(
    @GetUser() user: User
  ) {
    return this.userService.getUserById(user.id);
  }
  @UseGuards(JwtAuthGuard)
  @Query(() => LeaderboardResponse, {name: 'leaderboard'})
  getUserLeaderboard(
    @Args('limit', { type: () => Int }) limit: number,
    @GetUser() user: User
  ) {
    return this.userService.getUserLeaderboard(limit, user);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @Args('file', { type: () => GraphQLUpload, nullable: true }) file?: FileUpload,
    ) {
    if (file) {
      const uploadedPictureUrl = await this.uploadService.uploadFile(file);
      updateUserInput.picture = uploadedPictureUrl;
    }
    return await this.userService.updateUser(updateUserInput.id, updateUserInput);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => DeleteResponse)
  async removeUser(@Args('id', { type: () => ID }) id: MongooSchema.Types.ObjectId): Promise<DeleteResponse> {
    try {
      await this.userService.remove(id);
      return { success: true, message: 'user_deleted_successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  // @Mutation(() => String)
  // async singleUpload(
  //   @Args('file', { type: () => GraphQLUpload }) file: FileUpload,
  // ): Promise<string> {
  //   return this.uploadService.uploadFile(file);
  // }
}
