import { ObjectType, Field } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';

@ObjectType()
export class PageInfo {
  @Field(() => Boolean)
  hasNextPage: boolean;

  @Field(() => String)
  endCursor: string;

  @Field(() => Boolean)
  hasPreviousPage: boolean;

  @Field(() => String)
  startCursor: string;
}

interface paginationEntry {
    _id: ObjectId;
}

export const paginate = <T extends paginationEntry>(entries:T[], limit: number) => {

    const hasNextPage = entries.length === limit;
    let startCursor = null;
    let endCursor = null;


    const edges = entries.map(entry => ({
        cursor: entry._id.toString(),
        node: entry,
    }));

    if(entries.length > 0) {
        startCursor = entries[entries.length - 1]._id.toString()
        endCursor = entries[0]._id.toString()
    }

    const pageInfo: PageInfo = {
        hasNextPage,
        endCursor,
        hasPreviousPage: false,
        startCursor
    };

    return {
        edges,
        pageInfo,
    };
}