import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooSchema } from 'mongoose';
import { Author } from 'src/app/author/entities/author.entity';
import { User } from 'src/app/user/entities/user.entity';

@ObjectType()
@Schema()
export class Book {
  @Field(() => String)
  _id: MongooSchema.Types.ObjectId;

  // Add user properties
  @Field(() => String)
  @Prop()
  title: string;

  @Field(() => String)
  @Prop()
  description: string;

  @Field(() => Float)
  @Prop()
  price: number;

  @Field(() => String)
  @Prop()
  coverImage: string;

  @Field(() => String)
  @Prop({ unique: true })
  isbn: string;

  @Field(() => Author)
  @Prop({ type: MongooSchema.Types.ObjectId, ref: 'Author' })
  author: Author;

  @Field(() => [User])
  @Prop({ type: [{ type: MongooSchema.Types.ObjectId, ref: 'User' }] })
  readers: User[];
}

@ObjectType()
export class Edge {
  @Field(() => String)
  cursor: String
  
  @Field(() => Book, { nullable: false })
  node: Book;
}

@ObjectType()
export class PageInfo {
  @Field(() => Boolean)
  hasNextPage: Boolean

  @Field(() => String)
  endCursor: String
}

@ObjectType()
export class PaginationResult {
  @Field(() => [Edge])
  edges: [Edge]

  @Field(() => PageInfo)
  pageInfo: PageInfo
}

export type BookDocument = Book & Document;
export const BookSchema = SchemaFactory.createForClass(Book);