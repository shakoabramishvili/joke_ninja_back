import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";

@ObjectType()
@Schema()
export class Answer {
  @Field(() => String)
  @Prop()
  text: string;

  @Field(() => Boolean, {nullable: true})
  @Prop()
  canBeBest: boolean;

  @Field(() => Int, {nullable: true})
  @Prop()
  clickCount: Number
}