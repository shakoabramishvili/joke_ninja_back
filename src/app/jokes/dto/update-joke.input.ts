import { IsInt, IsMongoId } from 'class-validator';
import { CreateJokeInput } from './create-joke.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';

@InputType()
export class UpdateJokeInput extends PartialType(CreateJokeInput) {
  @Field(() => ID)
  @IsMongoId()
  _id: MongooSchema.Types.ObjectId;
}
