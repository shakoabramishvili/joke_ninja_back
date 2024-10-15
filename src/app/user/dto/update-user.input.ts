import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  @IsString()
  id: MongooSchema.Types.ObjectId;

  @Field(() => String, { nullable: true })
  @IsOptional()
  picture?: string;
}
