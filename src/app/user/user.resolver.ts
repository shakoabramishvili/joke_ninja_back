import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UserService } from './user.service';
import { PaginatedUsers, User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { Schema as MongooSchema } from 'mongoose';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.gards';
import { UseGuards } from '@nestjs/common';
import { GetUser } from '../shared/decorators/current-user.decorator';
import { LeaderboardResponse } from './dto/leaderboard-response';
import { DeleteResponse } from './dto/delete-response';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { UploadService } from '../shared/services/upload.service';
import { AddFriendInput } from './dto/add-friend.input';
import { PaginationArgs } from '../common/dto/get-paginated.args';

@Resolver(() => User)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedUsers, { name: 'users' })
  async findAll(
    @GetUser() user: User,
    @Args() args: PaginationArgs,
    @Args('search', { type: () => String, nullable: true }) search?: string,
  ) {
    if (search) {
      // Check if search term meets minimum length requirement
      if (search.length < 3) {
        // Return empty array if search term is too short
        return [];
      }
      return this.userService.findAllUsers(args, search, user?.id);
    }
    return this.userService.findAllUsers(args, undefined, user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => User, {})
  getUserById(
    @GetUser() user: User,
    @Args('id', { type: () => ID }) id: MongooSchema.Types.ObjectId,
  ) {
    return this.userService.getUserById(id, user.id);
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
    @Args() args: PaginationArgs,
    @Args('limit', { type: () => Int }) limit: number,
    @GetUser() user: User
  ) {
    return this.userService.getUserLeaderboard(args, limit, user);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => LeaderboardResponse, {name: 'LocalLeaderboard'})
  getUserLocalLeaderboard(
    @Args() args: PaginationArgs,
    @Args('limit', { type: () => Int }) limit: number,
    @GetUser() user: User
  ) {
    return this.userService.getUserLocalLeaderboard(args, limit, user);
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
}
