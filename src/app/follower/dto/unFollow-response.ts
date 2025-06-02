import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/entities/user.entity';

@ObjectType()
export class UnFollowResponse {
  @Field(() => User)
  follower: User;

  @Field(() => User)
  following: User;
}
