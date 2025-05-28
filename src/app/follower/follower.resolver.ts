import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Follower, FollowerUserEdge, PaginatedFollower } from "./entities/follower.entity";
import { FolloweService } from './follower.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.gards';
import { GetUser } from '../shared/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { FollowInput } from './dto/follow.input';
import { UnFollowInput } from './dto/unFollow.input';
import { Schema as MongooSchema } from 'mongoose';
import { PaginationArgs } from '../common/dto/get-paginated.args';

@Resolver(() => Follower)
export class FollowerResolver {
  constructor(private readonly followeService: FolloweService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => FollowerUserEdge)
  async follow(
    @GetUser() user: User,
    @Args('followInput') followInput: FollowInput,
  ) {
      return await this.followeService.createFollower(user.id, followInput.followingId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => FollowerUserEdge)
  async unFollow(
    @GetUser() user: User,
    @Args('unFollowInput') unFollowInput: UnFollowInput,
  ) {
      return await this.followeService.unFollow(user.id, unFollowInput.unFollowingId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedFollower, { name: 'followings' })
  async getFollowings(
    @GetUser() user: User,
    @Args('userId', { type: () => ID }) userId: MongooSchema.Types.ObjectId,
    @Args() args: PaginationArgs,
  ) {
    return this.followeService.getFollowings(args, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedFollower, { name: 'followers' })
  async getFollowers(
    @GetUser() user: User,
    @Args('userId', { type: () => ID }) userId: MongooSchema.Types.ObjectId,
    @Args() args: PaginationArgs,
  ) {
    return this.followeService.getFollowers(args, userId);
  }
}
