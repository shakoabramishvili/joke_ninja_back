import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { JokesService } from './jokes.service';
import { Joke, PaginatedJokes } from './entities/joke.entity';
import { CreateJokeInput } from './dto/create-joke.input';
import { UpdateJokeInput } from './dto/update-joke.input';
import { PaginationArgs } from '../common/dto/get-paginated.args';
import { IncrementAnswerCountInput } from './dto/increment-answer-count.input';
import { JokeResponse } from './dto/joke-response';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.gards';
import { Context } from 'apollo-server-core';
import { GetUser } from '../shared/decorators/current-user.decorator';
import { GqlAuthGuard } from '../shared/guards/gql-auth.guards';
import { User } from '../user/entities/user.entity';

@Resolver(() => Joke)
export class JokesResolver {
  constructor(private readonly jokesService: JokesService) {}

  @Mutation(() => JokeResponse)
  createJoke(@Args('createJokeInput') createJokeInput: CreateJokeInput) {
    return this.jokesService.create(createJokeInput);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedJokes, { name: 'jokes' })
  findAllJokes(@Args() args: PaginationArgs, @GetUser() user: User) {
    return this.jokesService.findAllJokes(args, user);
  }

  @Query(() => Joke, { name: 'joke' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.jokesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => JokeResponse)
  updateJoke(@Args('updateJokeInput') updateJokeInput: UpdateJokeInput, @GetUser() user: User) {
    return this.jokesService.updateJoke(updateJokeInput.id, updateJokeInput, user);
  }

  // @Mutation(() => Joke)
  // removeJoke(@Args('id', { type: () => Int }) id: number) {
  //   return this.jokesService.remove(id);
  // }
}
