import { InputType, Int, Field } from '@nestjs/graphql';
import { IsArray, IsString, IsUrl } from 'class-validator';
import { User } from 'src/app/user/entities/user.entity';

@InputType()
export class CreateJokeInput {
  @Field(() => String)
  @IsString()
  question: string;

  @Field(() => String)
  @IsUrl()
  coverImage: string;
}
