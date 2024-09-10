import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Document, Schema as MongooSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Book } from 'src/app/book/entities/book.entity';

@ObjectType()
@Schema()
export class User {
  @Field(() => ID)
  id: MongooSchema.Types.ObjectId;

  // Add user properties
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

  @Field(() => String, {  nullable: true})
  @Prop()
  password: string;

  @Field(() => String, { nullable: true })
  @Prop()
  address: string;

  @Field(() => Int, { defaultValue: 0 })
  @Prop()
  score: number

  // @Field(() => [Book])
  // @Prop({ type: [{ type: MongooSchema.Types.ObjectId, ref: 'Book' }] })
  // books: Book[];
}

@ObjectType()
export class LoginUserResponseR {
  @Field(() => User)
  user: User;

  @Field(() => String)
  authToken: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
