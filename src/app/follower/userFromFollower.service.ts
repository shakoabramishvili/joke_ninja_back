import { ObjectType } from "@nestjs/graphql";
import { User } from "../user/entities/user.entity";

// Wrapper type to avoid GraphQL type name conflicts (e.g. UserEdge)
@ObjectType('UserFromFollower')
export class UserFromFollower extends User {}