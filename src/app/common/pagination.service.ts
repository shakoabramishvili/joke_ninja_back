import { Injectable } from '@nestjs/common';
import { PaginationArgs } from './dto/get-paginated.args';
import { Edge, PageInfo } from './dto/pagination-result.type';

@Injectable()
export class PaginationService {
  async paginate<T extends { _id: any }>(
    results: T[],
    paginationArgs: PaginationArgs,
  ): Promise<any> {
    const { first, after, last, before } = paginationArgs;

    let paginatedResults: T[] = results;

    if (after) {
      const afterIndex = paginatedResults.findIndex(
        (item) => item._id.toString() === after,
      );
      if (afterIndex !== -1) {
        paginatedResults = paginatedResults.slice(afterIndex + 1);
      }
    }

    if (before) {
      const beforeIndex = paginatedResults.findIndex(
        (item) => item._id.toString() === before,
      );
      if (beforeIndex !== -1) {
        paginatedResults = paginatedResults.slice(0, beforeIndex);
      }
    }

    if (first) {
      paginatedResults = paginatedResults.slice(0, first);
    } else if (last) {
      paginatedResults = paginatedResults.slice(-last);
    }

    const startCursor = paginatedResults.length ? paginatedResults[0]._id.toString() : null;
    const endCursor = paginatedResults.length
      ? paginatedResults[paginatedResults.length - 1]._id.toString()
      : null;

    const hasPreviousPage = before
      ? results.findIndex((item) => item._id.toString() === before) > 0
      : false;
    const hasNextPage = after
      ? results.findIndex((item) => item._id.toString() === after) < results.length - 1
      : paginatedResults.length < results.length;

    const edges: Edge<T>[] = paginatedResults.map((doc) => ({
      node: doc,
      cursor: doc._id.toString(),
    }));

    const pageInfo: PageInfo = {
      hasNextPage,
      endCursor: endCursor || null,
      hasPreviousPage,
      startCursor: startCursor || null,
    };

    return {
      edges,
      pageInfo,
    };
  }
}
