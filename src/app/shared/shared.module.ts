import { Global, Module } from "@nestjs/common";
import { FirebaseModule } from "nestjs-firebase";
import * as path from 'path';
import { GoogleService } from "./services/google.service";
import { OpenAIService } from "./services/openai.service";
import { redisProvider } from "./providers/redis.provider";
import { RedisCacheService } from "./services/redis.service";

@Global()
@Module({
    imports: [
        FirebaseModule.forRoot({
            googleApplicationCredential: path.join(
              __dirname,
              '..',
              '..',
              '..',
              '/jokeninja-firebase-adminsdk.json',
            ),
          }),
    ],
    providers: [
      GoogleService, 
      OpenAIService, 
      redisProvider, 
      RedisCacheService
    ],
    exports: [
      OpenAIService, 
      RedisCacheService
    ]
})
export class SharedModule {}