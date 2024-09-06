import { IsInt, IsMongoId } from 'class-validator';
import { CreateJokeInput } from './create-joke.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';

@InputType()
export class UpdateJokeInput extends PartialType(CreateJokeInput) {
  @Field(() => String)
  @IsMongoId()
  _id: MongooSchema.Types.ObjectId;
}
