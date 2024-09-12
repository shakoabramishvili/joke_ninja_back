import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Joke } from "../entities/joke.entity";

@ObjectType()
export class JokeResponse {
  @Field(() => Joke)
  joke: Joke;

  @Field(() => Int)
  userScored: Number
}