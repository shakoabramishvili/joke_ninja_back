import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Document, Schema as MongooSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@ObjectType()
@Schema({ timestamps: true })
export class DeletedUser {
  @Field(() => ID)
  id: MongooSchema.Types.ObjectId;

  @Field(() => String, { nullable: true })
  @Prop()
  name: string;

  @Field(() => String)
  @Prop()
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

// @ObjectType()
// export class LoginUserResponseR {
//   @Field(() => User)
//   user: User;

//   @Field(() => String)
//   authToken: string;
// }

// @ObjectType()
// export class PaginatedUsers extends Paginated(User) {}

export type DeletedUserDocument = DeletedUser & Document;
export const DeletedUserSchema = SchemaFactory.createForClass(DeletedUser);
