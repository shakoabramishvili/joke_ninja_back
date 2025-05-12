// import { CreateAuthorInput } from './create-author.input';
import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';
import { IsString } from 'class-validator';

@InputType()
export class UnFollowInput {
  @Field(() => ID)
  unFollowingId: MongooSchema.Types.ObjectId;
} 
