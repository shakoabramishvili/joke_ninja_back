import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { GeneratorType, PromptContext } from '../ai-interactions.service';

@ObjectType()
@Schema({ timestamps: true })
export class AiInteraction {
  @Field(() => ID)
  id: MongooseSchema.Types.ObjectId;

  @Field(() => String)
  @Prop({ type: String, enum: GeneratorType, required: true })
  generatorType: GeneratorType;

  @Field(() => String)
  @Prop({ type: String, enum: PromptContext, required: true })
  promptContext: PromptContext;

  @Field(() => String)
  @Prop({ required: true })
  prompt: string;

  @Field(() => String)
  @Prop({ required: true })
  generatedText: string;

  @Field(() => [Object], { nullable: true })
  @Prop({ type: [Object], required: false })
  userInfo?: { key: string; description: string }[];

  @Field(() => [Object], { nullable: true })
  @Prop({ type: [Object], required: false })
  secondUserInfo?: { key: string; description: string }[];

  @Field(() => Date)
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field(() => Date)
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type AiInteractionDocument = AiInteraction & Document;
export const AiInteractionSchema = SchemaFactory.createForClass(AiInteraction);
