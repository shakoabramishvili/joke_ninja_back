import { Field, Int, ObjectType } from "@nestjs/graphql";
import { PaginatedUsers, User } from "../entities/user.entity";

@ObjectType()
export class LeaderboardResponse {
  @Field(() => PaginatedUsers)
  users: PaginatedUsers;

  @Field(() => Int)
  currentUserRank: number;
}