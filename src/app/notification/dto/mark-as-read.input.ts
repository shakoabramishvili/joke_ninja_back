import { Field, ID, InputType } from "@nestjs/graphql";
import { ArrayNotEmpty, IsArray, IsMongoId } from "class-validator";
import { Schema as MongooSchema } from 'mongoose';

@InputType()
export class MarkAsReadInput {
  @Field(() => [ID])
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  notificationIds: string[];
}