import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Document, Schema as MongooSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/app/user/entities/user.entity';
import { EdgeType, PageInfo } from 'src/app/common/dto/pagination-result.type';
import { UserFromFollower } from '../userFromFollower.service';
// import { Book } from 'src/app/book/entities/book.entity';

@ObjectType()
@Schema({ timestamps: true })
export class Follower {
  @Field(() => ID)
  id: MongooSchema.Types.ObjectId;

  @Prop({ type: MongooSchema.Types.ObjectId, ref: 'User', required: true })
  @Field(() => User)
  following: User;

  @Prop({ type: MongooSchema.Types.ObjectId, ref: 'User', required: true })
  @Field(() => User)
  follower: User;

  @Field(() => Date)
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field(() => Date)
  @Prop({ default: Date.now })
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @Prop()
  deletedAt?: Date;
}

@ObjectType('FollowerUserEdge')
export class FollowerUserEdge extends EdgeType<User> {
  @Field(() => String)
  cursor: string;

  @Field(() => User)
  node: User;
}

@ObjectType()
export class PaginatedFollower {
  @Field(() => [FollowerUserEdge])
  edges: FollowerUserEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}

@ObjectType()
export class FollowResult {
  @Field(() => User)
  follower: User;

  @Field(() => FollowerUserEdge)
  followingEdge: FollowerUserEdge;
}

export type FollowerDocument = Follower & Document;
export const FollowerSchema = SchemaFactory.createForClass(Follower);
