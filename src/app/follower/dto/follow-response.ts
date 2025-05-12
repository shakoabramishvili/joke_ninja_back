import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class FollowResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;
}