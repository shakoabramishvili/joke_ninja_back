import { Field, InputType, Int } from "@nestjs/graphql";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { FunnyRank } from "src/app/shared/enum/funnyRank.enum";

@InputType()
export class CreateAnswerInput {
  @Field(() => String)
  @IsString()
  text: string;

  @Field(() => FunnyRank)
  @IsEnum(FunnyRank)
  funnyRank: FunnyRank;

  @Field(() => Int, { defaultValue: 0 })
  @IsOptional()
  @IsInt()
  clickCount: number;
}