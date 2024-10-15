import { Global, Module } from "@nestjs/common";
import { FirebaseModule } from "nestjs-firebase";
import * as path from 'path';
import { GoogleService } from "./services/google.service";
import { UploadService } from "./services/upload.service";

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
    providers: [GoogleService, UploadService],
    exports: [UploadService]
})
export class SharedModule {}