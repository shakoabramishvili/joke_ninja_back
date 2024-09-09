import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { JokesService } from './jokes.service';
import { Joke, PaginatedJokes } from './entities/joke.entity';
import { CreateJokeInput } from './dto/create-joke.input';
import { UpdateJokeInput } from './dto/update-joke.input';
import { PaginationArgs } from '../common/dto/get-paginated.args';
import { IncrementAnswerCountInput } from './dto/increment-answer-count.input';
import { JokeResponse } from './dto/joke-response';

@Resolver(() => Joke)
export class JokesResolver {
  constructor(private readonly jokesService: JokesService) {}

  @Mutation(() => JokeResponse)
  createJoke(@Args('createJokeInput') createJokeInput: CreateJokeInput) {
    return this.jokesService.create(createJokeInput);
  }

  @Query(() => PaginatedJokes, { name: 'jokes' })
  findAllJokes(@Args() args: PaginationArgs) {
    return this.jokesService.findAllJokes(args);
  }

  // @Query(() => Joke, { name: 'joke' })
  // findOne(@Args('id', { type: () => Int }) id: number) {
  //   return this.jokesService.findOne(id);
  // }

  @Mutation(() => JokeResponse)
  updateJoke(@Args('updateJokeInput') updateJokeInput: UpdateJokeInput) {
    return this.jokesService.updateJoke(updateJokeInput.id, updateJokeInput);
  }

  // @Mutation(() => JokeResponse)
  // incrementAnswerCount(@Args('incrementAnswerCountInput') incrementAnswerCountInput: IncrementAnswerCountInput) {
  //   return this.jokesService.incrementAnswerCount(incrementAnswerCountInput.id, incrementAnswerCountInput);
  // }

  // @Mutation(() => Joke)
  // removeJoke(@Args('id', { type: () => Int }) id: number) {
  //   return this.jokesService.remove(id);
  // }
}
