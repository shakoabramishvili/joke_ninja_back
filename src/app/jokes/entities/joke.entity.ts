import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooSchema } from 'mongoose';
import { Paginated } from '../../common/dto/pagination-result.type';
import { Answer } from './answers.entity';
import { User } from 'src/app/user/entities/user.entity';

@ObjectType()
@Schema({ timestamps: true })
export class Joke {
  @Field(() => ID)
  id: MongooSchema.Types.ObjectId;

  @Field(() => String)
  @Prop()
  question: string;

  @Field(() => [Answer])
  @Prop()
  answers: Answer[];

  @Field(() => String, { nullable: true })
  @Prop()
  coverImage: string;

  @Field(() => Date)
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field(() => Date)
  @Prop({ default: Date.now })
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @Prop()
  deletedAt?: Date;

  @Field(() => ID, { nullable: true })
  @Prop({ type: MongooSchema.Types.ObjectId })
  userId: MongooSchema.Types.ObjectId;
}

@ObjectType()
export class PaginatedJokes extends Paginated(Joke) {}

export type JokeDocument = Joke & Document;
export const JokeSchema = SchemaFactory.createForClass(Joke);
