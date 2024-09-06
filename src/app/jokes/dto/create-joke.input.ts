import { InputType, Int, Field } from '@nestjs/graphql';
import { IsArray, IsString, IsUrl } from 'class-validator';

@InputType()
export class CreateJokeInput {
  @Field(() => String)
  @IsString()
  question: string;

  @Field(() => String)
  @IsUrl()
  coverImage: string;
}
