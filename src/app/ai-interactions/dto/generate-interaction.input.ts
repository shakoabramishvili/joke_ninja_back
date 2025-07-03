import { Field, InputType } from '@nestjs/graphql';
import { PromptContext } from '../ai-interactions.service';

@InputType()
export class GenerateInteractionInput {
  @Field(() => String)
  promptContext: PromptContext;

  @Field(() => String)
  userId: string;

  @Field(() => String, { nullable: true })
  secondUserId?: string;
}
