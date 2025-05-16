import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FollowerResolver } from './follower.resolver';
import { FolloweService } from './follower.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Follower, FollowerSchema } from './entities/follower.entity';
import { User, UserSchema } from '../user/entities/user.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  providers: [FollowerResolver, FolloweService, ConfigService],
  imports: [
    MongooseModule.forFeature([
      { name: Follower.name, schema: FollowerSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ConfigModule.forRoot({
      cache: true,
    }),
    NotificationModule
  ],
  // make sure the UserService is exported so that it's not longer private
  exports: [FolloweService],
})
export class FollowerModule {}
