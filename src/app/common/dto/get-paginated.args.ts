import { Field, ArgsType, Int } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';

@ArgsType()
export class PaginationArgs { //need
  @Field(() => Int, { nullable: true })
  first: number;

  @Field(() => String, { nullable: true })
  after: string;

  @Field(() => Int, { nullable: true })
  last: number;

  @Field(() => String, { nullable: true })
  before: string;
}

// @ArgsType()
// export class PaginationInput {
//   @Field(() => String, {nullable: true })
//   after?: MongooSchema.Types.ObjectId;

//   @Field(() => Int, {nullable: true })
//   first?: number
// }