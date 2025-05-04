import { InputType, Field, ID } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';

@InputType()
export class AddFriendInput {
  @Field(() => ID)
  friendId: MongooSchema.Types.ObjectId;
} 