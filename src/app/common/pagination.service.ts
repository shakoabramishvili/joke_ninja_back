import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { PaginationArgs } from './dto/get-paginated.args';
import { Edge, PageInfo } from './dto/pagination-result.type';

@Injectable()
export class PaginationService {
    async paginate<T>(
        model: Model<T>,
        paginationArgs: PaginationArgs,
        populateFields?: string[]
    ): Promise<any> {
        const { first, after, last, before } = paginationArgs;

        let query = model.find();

        if (populateFields?.length) {
            query = query.populate(populateFields.join(' ')) as any;
        }

        const limit = first ? first : (last ? last : 0);
        
        if (after) {
            const lastDocument = await model.findById(after).exec();
            if (lastDocument) {
                query = query.where('id').gt(lastDocument.id as any);
            }
        }
     
        if (before) {
            const firstDocument = await model.findById(before).exec();
            console.log(firstDocument, 'firstDocument')
            if (firstDocument) {
                query = query.where('id').lt(firstDocument.id as any);
            }
        }
        query = query.limit(limit);
        
        const results = await query.exec();

        const startCursor = results.length ? results[0].id.toString() : null
        const endCursor = results.length ? results[results.length - 1].id.toString() : null

        const beforeQuery = model.find();
        const beforeCount = await beforeQuery.where('id').lt(startCursor as any).count().exec();

        const afterQuery = model.find();
        const afterCount = await afterQuery.where('id').gt(endCursor as any).count().exec();

        const edges: Edge<T>[] = results.map((doc) => ({
            node: doc,
            cursor: doc.id.toString(),
        }));

        const pageInfo: PageInfo = {
            hasNextPage: afterCount > 0,
            endCursor,
            hasPreviousPage: beforeCount > 0,
            startCursor: startCursor
        };
     
        return {
            edges,
            pageInfo,
        };
    }
}
