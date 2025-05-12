import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UnFollowResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;
}