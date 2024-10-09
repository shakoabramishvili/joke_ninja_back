import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from '../common/common.module';
import { DeletedUser, DeletedUserSchema } from './entities/deletedUser.entity';

@Module({
  providers: [UserResolver, UserService, ConfigService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: DeletedUser.name, schema: DeletedUserSchema }
    ]),
    ConfigModule.forRoot({
      cache: true,
    }),
    CommonModule
  ],
  // make sure the UserService is exported so that it's not longer private
  exports: [UserService],
})
export class UserModule {}
