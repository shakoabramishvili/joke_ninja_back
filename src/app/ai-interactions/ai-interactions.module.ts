import { Module } from '@nestjs/common';
import { AiInteractionsService } from './ai-interactions.service';
import { AiInteractionsResolver } from './ai-interactions.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AiInteraction,
  AiInteractionSchema,
} from './entities/ai-interaction.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AiInteraction.name, schema: AiInteractionSchema },
    ]),
    UserModule,
  ],
  providers: [AiInteractionsService, AiInteractionsResolver],
  exports: [AiInteractionsService],
})
export class AiInteractionsModule {}
