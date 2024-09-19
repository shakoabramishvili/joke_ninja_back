import { Field, ObjectType } from "@nestjs/graphql";
import { Type } from "@nestjs/common";

@ObjectType({ isAbstract: true })
export abstract class EdgeType<T> { //need
  @Field(() => String)
  cursor: string;

  node: T;
}

export class Edge<T> { //need
    cursor: string;
    node: T;
  
    constructor(cursor: string, node: T) {
      this.cursor = cursor;
      this.node = node;
    }
}
  
@ObjectType()
export class PageInfo {
    @Field(() => Boolean)
    hasNextPage: boolean;

    @Field(() => String, { nullable: true })
    endCursor?: string;

    @Field(() => Boolean)
    hasPreviousPage: boolean;

    @Field(() => String, { nullable: true })
    startCursor?: string;
}

export function Paginated<T>(classRef: Type<T>): any { //need
    @ObjectType(`${classRef.name}Edge`, { isAbstract: true })
    abstract class EdgeType {
        @Field(() => String)
        cursor: string;

        @Field(() => classRef)
        node: T;
    }

    @ObjectType({ isAbstract: true })
    abstract class PaginatedType {
        @Field(() => [EdgeType], { nullable: true })
        edges: EdgeType[];

        @Field(() => PageInfo, { nullable: true })
        pageInfo: PageInfo;
    }
        
    return PaginatedType;
}   