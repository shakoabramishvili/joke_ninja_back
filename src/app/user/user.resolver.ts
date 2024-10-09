import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UserService } from './user.service';
import { PaginatedUsers, User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Schema as MongooSchema } from 'mongoose';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.gards';
import { UseGuards } from '@nestjs/common';
import { GetUser } from '../shared/decorators/current-user.decorator';
import { PaginationArgs } from '../common/dto/get-paginated.args';
import { LeaderboardResponse } from './dto/leaderboard-response';
import { DeleteResponse } from './dto/delete-response';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

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

  // @Mutation(() => User)
  // updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
  //   return this.userService.updateUser(updateUserInput.id, updateUserInput);
  // }

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
