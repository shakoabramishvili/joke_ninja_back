import { Args, Query, Resolver } from '@nestjs/graphql';
import { AiInteractionsService } from './ai-interactions.service';
import { GenerateInteractionInput } from './dto/generate-interaction.input';

@Resolver()
export class AiInteractionsResolver {
  constructor(private readonly aiInteractionsService: AiInteractionsService) {}

  @Query(() => String)
  async generateAiInteraction(@Args('input') input: GenerateInteractionInput) {
    return this.aiInteractionsService.generateInteraction(input.promptContext);
  }
}
