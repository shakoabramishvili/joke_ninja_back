import { Field, InputType, Int } from "@nestjs/graphql";
import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

@InputType()
export class CreateAnswerInput {
  @Field(() => String)
  @IsString()
  text: string;

  @Field(() => Boolean)
  @IsBoolean()
  canBeBest: boolean;

  @Field(() => Int, { defaultValue: 0 })
  @IsOptional()
  @IsInt()
  clickCount: number;
}