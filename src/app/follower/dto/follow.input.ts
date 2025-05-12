import { InputType, Field, ID } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';

@InputType()
export class FollowInput {
  @Field(() => ID)
  followingId: MongooSchema.Types.ObjectId;
} 
