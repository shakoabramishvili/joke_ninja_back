import { Field, ObjectType } from "@nestjs/graphql";
import { Joke } from "../entities/joke.entity";

@ObjectType()
export class JokeResponse {
  @Field(() => Joke)
  joke: Joke;
}