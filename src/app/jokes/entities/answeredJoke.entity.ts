import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Document, Schema as MongooSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';


@ObjectType()
@Schema({ timestamps: true })
export class AnsweredJoke {
  @Field(() => ID)
  _id: MongooSchema.Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: MongooSchema.Types.ObjectId, required: true, index: true })
  userId: MongooSchema.Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: MongooSchema.Types.ObjectId, required: true, index: true })
  jokeId: MongooSchema.Types.ObjectId;

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

export type AnsweredJokeDocument = AnsweredJoke & Document;
export const AnsweredJokeSchema = SchemaFactory.createForClass(AnsweredJoke);

AnsweredJokeSchema.index({ userId: 1, jokeId: 1 }, { unique: true });