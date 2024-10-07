import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AuthMethodEnum } from '../../shared/enum/authMethod.enum';

@InputType()
export class SocialAuthInput {
  @Field(() => AuthMethodEnum)
  method: AuthMethodEnum;

  @Field(() => String)
  @IsString()
  accessToken: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  fcmToken?: string;
}
