import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateJokeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
