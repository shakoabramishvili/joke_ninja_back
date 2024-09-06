import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooSchema } from 'mongoose';
import { Paginated } from 'src/app/common/dto/pagination-result.type';
import { Answer } from './answers.entity';

@ObjectType()
@Schema()
export class Joke {
  @Field(() => ID)
  _id: MongooSchema.Types.ObjectId;

  @Field(() => String)
  @Prop()
  question: string;

  @Field(() => [Answer])
  @Prop()
  answers: Answer[];

  @Field(() => String, {nullable: true})
  @Prop()
  coverImage: string;
}

@ObjectType()
export class PaginatedJokes extends Paginated(Joke) { }

export type JokeDocument = Joke & Document;
export const JokeSchema = SchemaFactory.createForClass(Joke);