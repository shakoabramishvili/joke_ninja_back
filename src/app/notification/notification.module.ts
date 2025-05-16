import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Notifications, NotificationsSchema } from './entities/notifications.entity';
import { NotificationResolver } from './notification.resolver';
import { CommonModule } from '../common/common.module';

@Module({
  providers: [NotificationResolver, NotificationService],
  exports: [NotificationService],
  imports: [
    MongooseModule.forFeature([
      { name: Notifications.name, schema: NotificationsSchema },
    ]),
    CommonModule
  ],
})
export class NotificationModule {}