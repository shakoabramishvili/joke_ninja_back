import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Document, Schema as MongooSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Paginated } from 'src/app/common/dto/pagination-result.type';
// import { Book } from 'src/app/book/entities/book.entity';

@ObjectType()
@Schema()
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
  externalId: string

  @Field(() => String)
  @Prop()
  externalType: string

  @Field(() => Int, { defaultValue: 0 })
  @Prop()
  score: number

  @Field(() => String, { nullable: true })
  @Prop()
  picture: string
}

@ObjectType()
export class LoginUserResponseR {
  @Field(() => User)
  user: User;

  @Field(() => String)
  authToken: string;
}

@ObjectType()
export class PaginatedUsers extends Paginated(User) { }

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
