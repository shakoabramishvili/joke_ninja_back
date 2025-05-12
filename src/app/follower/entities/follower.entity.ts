import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Document, Schema as MongooSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/app/user/entities/user.entity';
import { Paginated } from 'src/app/common/dto/pagination-result.type';
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

@ObjectType()
export class PaginatedFollower extends Paginated(Follower) {}

export type FollowerDocument = Follower & Document;
export const FollowerSchema = SchemaFactory.createForClass(Follower);
