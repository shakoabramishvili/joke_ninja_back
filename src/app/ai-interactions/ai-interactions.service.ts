import { Injectable } from '@nestjs/common';
import { AIChat } from '../../AIGenerator/OpenAI';
import {
  AIgeneratesInteraction,
  UserSpecificGenerator,
  U2Ugenerator,
  followJokeGeneratorGeneral,
} from '../../AIGenerator/IntercationGenerators';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AiInteraction,
  AiInteractionDocument,
} from './entities/ai-interaction.entity';
import { UserService } from '../user/user.service';

export enum GeneratorType {
  GENERAL = 'general',
  USER_TO_USER = 'userToUser',
  USER_SPECIFIC = 'userSpecific',
}

export enum PromptContext {
  FOLLOW = 'follow',
  UNFOLLOW = 'unfollow',
  ANSWER_SELF = 'answerSelf',
}

interface UserInfo {
  key: string;
  description: string;
}

@Injectable()
export class AiInteractionsService {
  constructor(
    @InjectModel(AiInteraction.name)
    private aiInteractionModel: Model<AiInteractionDocument>,
    private userService: UserService,
  ) {}

  async generateInteraction(
    promptContext: PromptContext,
    userId?: string,
    secondUserId?: string,
  ) {
    
    let generatorType: GeneratorType;
    let prompt: string = '';
    let userInfo: UserInfo[] | undefined;
    let secondUserInfo: UserInfo[] | undefined;
    let generatedText: string;

    // Get user info
    if (userId) userInfo = [];

    // Determine generator type and prompt based on context and secondUserId
    if (secondUserId) {
      generatorType = GeneratorType.USER_TO_USER;
      secondUserInfo = [];
    } else {
      generatorType = GeneratorType.USER_SPECIFIC;
    }

    // Generate text based on generator type
    switch (promptContext) {
      case PromptContext.FOLLOW:
        let followRes = await followJokeGeneratorGeneral('followed');
        generatedText = followRes.generated;
        prompt = followRes.prompt;
        break;
      case PromptContext.UNFOLLOW:
        let unFollowRes = await followJokeGeneratorGeneral('unfollowed');
        generatedText = unFollowRes.generated;
        prompt = unFollowRes.prompt;
        break;
      default:
        const defaultRes = await followJokeGeneratorGeneral('followed');
        generatedText = defaultRes.generated;
        prompt = defaultRes.prompt;
    }

    // Save the interaction to the database
    const aiInteraction = new this.aiInteractionModel({
      generatorType,
      promptContext,
      prompt,
      generatedText,
      userInfo,
      secondUserInfo,
    });
    // we await because in future, we also will take it from db
    await aiInteraction.save();
    return aiInteraction.generatedText;
  }
}
