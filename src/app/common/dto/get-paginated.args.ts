import { Field, ArgsType, Int } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';

@ArgsType()
export class GetPaginatedArgs {
  @Field(() => Int, { defaultValue: 10, nullable: true })
  limit?: number;

  @Field(() => Int, { defaultValue: 0, nullable: true })
  skip?: number;
}

@ArgsType()
export class PaginationInput {
  @Field(() => String, {nullable: true })
  after?: MongooSchema.Types.ObjectId;

  @Field(() => Int, {nullable: true })
  first?: number
}