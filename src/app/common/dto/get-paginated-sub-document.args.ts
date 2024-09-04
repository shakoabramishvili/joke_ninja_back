import { Field, ArgsType, PartialType } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';
import { PaginationArgs } from './get-paginated.args';

@ArgsType()
export class GetPaginatedSubDocumentsArgs extends PartialType(
  PaginationArgs,
) {
  @Field(() => String)
  _id: MongooSchema.Types.ObjectId;
}
