import { InputType, Int, Field } from '@nestjs/graphql';
import { IsArray, IsString, IsUrl, ValidateNested } from 'class-validator';
import { CreateAnswerInput } from './create-answer.input';
import { Type } from 'class-transformer';

@InputType()
export class CreateJokeInput {
  @Field(() => String)
  @IsString()
  question: string;

  @Field(() => String)
  @IsUrl()
  coverImage: string;

  @Field(() => [CreateAnswerInput], { nullable: true })
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerInput)
  answers?: CreateAnswerInput[];
}
