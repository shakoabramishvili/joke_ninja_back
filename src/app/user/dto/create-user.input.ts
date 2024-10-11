import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsOptional()
  name?: string;

  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  externalId: string;

  @Field(() => String)
  externalType: string;

  @Field(() => String)
  picture: string;

  @Field(() => String)
  @IsOptional()
  myJoke?: string
}
