import { Field, Int, ObjectType } from "@nestjs/graphql";
import { User } from "../entities/user.entity";

@ObjectType()
export class LeaderboardResponse {
  @Field(() => [User])
  users: User[];

  @Field(() => Int)
  currentUserRank: number;
}