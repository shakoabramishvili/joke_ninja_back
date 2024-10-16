import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { JokesService } from './jokes.service';
import { Joke, JokeMutationEdge, PaginatedJokes } from './entities/joke.entity';
import { CreateJokeInput } from './dto/create-joke.input';
import { UpdateJokeInput } from './dto/update-joke.input';
import { PaginationArgs } from '../common/dto/get-paginated.args';
import { JokeResponse } from './dto/joke-response';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.gards';
import { GetUser } from '../shared/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { Schema as MongooSchema } from 'mongoose';
import { EdgeType } from '../common/dto/pagination-result.type';

@Resolver(() => Joke)
export class JokesResolver {
  constructor(private readonly jokesService: JokesService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => JokeMutationEdge)
  async createJoke(
    @Args('createJokeInput') createJokeInput: CreateJokeInput,
    @GetUser() user: User,
  ) {
    const joke = await this.jokesService.create(createJokeInput, user);
    return {
      cursor: joke._id.toString(),
      node: joke,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedJokes, { name: 'jokes' })
  findAllJokes(@Args() args: PaginationArgs, @GetUser() user: User) {
    return this.jokesService.findAllJokes(args, user);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedJokes, { name: 'myJokes' })
  findMyJokes(@Args() args: PaginationArgs, @GetUser() user: User) {
    return this.jokesService.findMyAllJokes(args, user);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Joke, { name: 'joke' })
  findOne(@Args('id', { type: () => ID }) id: MongooSchema.Types.ObjectId) {
    return this.jokesService.findOne(id);
  }

  @Query(() => Joke, { name: 'publicSingleJoke' })
  publicSingleJoke(
    @Args('id', { type: () => ID }) id: MongooSchema.Types.ObjectId,
  ) {
    return this.jokesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => JokeResponse)
  updateJoke(
    @Args('updateJokeInput') updateJokeInput: UpdateJokeInput,
    @GetUser() user: User,
  ) {
    return this.jokesService.updateJoke(
      updateJokeInput.id,
      updateJokeInput,
      user,
    );
  }
}
