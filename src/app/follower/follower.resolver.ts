import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
// import { AuthorService } from './author.service';
// import { Author, GetAuthorsPaginatedResponse } from './entities/author.entity';
// import { CreateAuthorInput } from './dto/create-author.input';
// import { UpdateAuthorInput } from './dto/update-author.input';
// import { Schema as MongooSchema } from 'mongoose';
// import { PaginationArgs } from '../common/dto/get-paginated.args';
// import { JwtAuthGuard } from '../auth/jwt-auth.gards';
// import { UseGuards } from '@nestjs/common';

import { Follower } from "./entities/follower.entity";
import { FolloweService } from './follower.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.gards';
import { GetUser } from '../shared/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { FollowInput } from './dto/follow.input';
import { UnFollowInput } from './dto/unFollow.input';
import { UnFollowResponse } from './dto/unFollow-response';
import { FollowResponse } from './dto/follow-response';

@Resolver(() => Follower)
export class FollowerResolver {
  constructor(private readonly followeService: FolloweService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async follow(
    @GetUser() user: User,
    @Args('followInput') followInput: FollowInput,
  ) {
      return await this.followeService.createFollower(user.id, followInput.followingId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => User)
  async unFollow(
    @GetUser() user: User,
    @Args('unFollowInput') unFollowInput: UnFollowInput,
  ) {
      return await this.followeService.unFollow(user.id, unFollowInput.unFollowingId);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [User])
  async getFollowings(@GetUser() user: User) {
    return this.followeService.getFollowings(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [User])
  async getFollowers(@GetUser() user: User) {
    return this.followeService.getFollowers(user.id);
  }
}
