import { Injectable } from "@nestjs/common";
import { OAuth2Client } from "google-auth-library";

@Injectable()
export class GoogleService {
    private client;

    onModuleInit() {
        if (!this.client) {
          this.client = new OAuth2Client(
            '365786239682-59vbr2at9t3418m50ltd49crb2aosh06.apps.googleusercontent.com',
          );
        }
      }

    async verifyToken(token: string) {
        try {
          return await this.client.getTokenInfo(token);
        } catch (error) {
          console.log('error', error);
        }
        return false;
      }
}