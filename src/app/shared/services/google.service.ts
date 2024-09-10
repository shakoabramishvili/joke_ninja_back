import { Injectable } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";

@Injectable()
export class GoogleService {
    private client;

    onModuleInit() {
        if (!this.client) {
          this.client = new OAuth2Client(
            '365786239682-59vbr2at9t3418m50ltd49crb2aosh06.apps.googleusercontent.com', //backend
          );
        }
      }

    async verifyToken(token: string) {
        try {
          const { payload } = await this.client.verifyIdToken({
            idToken: token,
            audience: [
              '365786239682-fl96r6oml4rhr5srqb41mo3fdlirci36.apps.googleusercontent.com', //ios
              '365786239682-a7makojucnvh3hgie5b0ce9q77vbfte3.apps.googleusercontent.com' //android
            ], 
          })

          return payload
        } catch (error) {
          console.log('error', error);
        }
        return false;
      }
}