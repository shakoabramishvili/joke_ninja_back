import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Document, Schema as MongooSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Paginated } from '../../common/dto/pagination-result.type';
// import { Book } from 'src/app/book/entities/book.entity';

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID)
  id: MongooSchema.Types.ObjectId;

  @Field(() => String, { nullable: true })
  @Prop()
  name: string;

  @Field(() => String)
  @Prop({ unique: true })
  email: string;

  @Field(() => String)
  @Prop()
  externalId: string;

  @Field(() => String)
  @Prop()
  externalType: string;

  @Field(() => Int, { defaultValue: 0 })
  @Prop({ default: 0 })
  score: number;

  @Field(() => Int, { defaultValue: 0 })
  @Prop()
  rank: number;

  @Field(() => String, { nullable: true })
  @Prop()
  picture: string;

  @Field(() => String, { nullable: true })
  @Prop()
  myJoke: string;

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
export class LoginUserResponseR {
  @Field(() => User)
  user: User;

  @Field(() => String)
  authToken: string;
}

@ObjectType()
export class PaginatedUsers extends Paginated(User) {}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
