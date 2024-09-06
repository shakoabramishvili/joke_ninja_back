import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsMongoId } from "class-validator";
import { Schema as MongooSchema } from 'mongoose';

@InputType()
export class IncrementAnswerCountInput {
  @Field(() => String)
  @IsMongoId()
  _id: MongooSchema.Types.ObjectId;

  @Field(() => Int)
  @IsInt()
  answerIndex: number;  // The index of the answer to update
}