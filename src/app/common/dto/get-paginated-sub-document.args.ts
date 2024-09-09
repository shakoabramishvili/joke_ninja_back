import { Field, ArgsType, PartialType, ID } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';
import { PaginationArgs } from './get-paginated.args';

@ArgsType()
export class GetPaginatedSubDocumentsArgs extends PartialType(
  PaginationArgs,
) {
  @Field(() => ID)
  id: MongooSchema.Types.ObjectId;
}
