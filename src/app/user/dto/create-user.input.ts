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
  // @IsStrongPassword({
  //   minLength: 6,
  //   minLowercase: 1,
  //   minNumbers: 1,
  //   minSymbols: 1,
  //   minUppercase: 1,
  // })
  @IsOptional()
  password?: string;

  @Field(() => String)
  @IsOptional()
  address?: string;
}
