import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";
import { FunnyRank } from "src/app/shared/enum/funnyRank.enum";

@ObjectType()
@Schema()
export class Answer {
  @Field(() => String)
  @Prop()
  text: string;

  @Field(() => FunnyRank)
  @Prop()
  funnyRank: FunnyRank;

  @Field(() => Int)
  @Prop({ default: 0 })
  clickCount: number;
}