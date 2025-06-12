import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooSchema } from 'mongoose';
import {
  Notifications,
  NotificationsDocument,
} from './entities/notifications.entity';
import { User } from '../user/entities/user.entity';
import { NotificationTypeEnum } from '../shared/enum/notificationType.enum';
import { PaginationArgs } from '../common/dto/get-paginated.args';
import { PaginationService } from '../common/pagination.service';
import { MarkAsReadInput } from './dto/mark-as-read.input';
import { Joke } from '../jokes/entities/joke.entity';

export interface pushNotificationData extends sendNotification {
  title: string;
  body: string;
  badge: number;
  data: object;
}

export interface sendNotification {
  expoPushToken: string;
  sender: User;
  reciever: User;
  joke?: Joke;
}

export interface messageInterface {
  to: string;
  sound: string;
  title: string;
  body: string;
  badge: number;
  data: object;
}

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notifications.name)
    private notificationModel: Model<NotificationsDocument>,
    private readonly paginationService: PaginationService,
  ) {}

  async sendPushNotification(pushData: pushNotificationData) {
    const message: messageInterface = {
      to: pushData.expoPushToken,
      sound: 'default',
      title: pushData.title,
      body: pushData.body,
      badge: pushData.badge,
      data: pushData.data,
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  }

  async sendCreateJokeNotification(sendNotification: sendNotification) {
    // Step 1: Count unread notifications for this user
    const unreadCount = await this.notificationModel.countDocuments({
      userId: sendNotification.reciever.id,
      isRead: false,
    });

    // Step 2: Prepare push payload
    const pushNotificationData: pushNotificationData = {
      ...sendNotification,
      title: `${sendNotification.sender.name}`,
      body: 'Is boiling something!',
      badge: unreadCount + 1, // Incrementing by 1 to include this new one
      data: { jokeId: sendNotification.joke?.id },
    };

    // Step 3: Send push notification
    await this.sendPushNotification(pushNotificationData);

    // Step 4: Save the notification in DB
    const notification = new this.notificationModel({
      type: NotificationTypeEnum.CREATE_JOKE,
      title: pushNotificationData.title,
      message: pushNotificationData.body,
      userId: sendNotification.reciever.id,
      sender: sendNotification.sender.id,
      isRead: false,
      data: JSON.stringify(pushNotificationData),
      jokeId: sendNotification.joke.id,
    });

    await notification.save();
  }

  async sendFollowNotification(sendNotification: sendNotification) {
    // Step 1: Count unread notifications for this user
    const unreadCount = await this.notificationModel.countDocuments({
      userId: sendNotification.reciever.id,
      isRead: false,
    });

    // Step 2: Prepare push payload
    const pushNotificationData: pushNotificationData = {
      ...sendNotification,
      title: `${sendNotification.sender.name} is watching you`,
      body: 'Make their life harder!',
      badge: unreadCount + 1, // Incrementing by 1 to include this new one
      data: { userId: sendNotification.sender.id },
    };

    // Step 3: Send push notification
    await this.sendPushNotification(pushNotificationData);

    // Step 4: Save the notification in DB
    const notification = new this.notificationModel({
      type: NotificationTypeEnum.FOLLOW,
      title: pushNotificationData.title,
      message: pushNotificationData.body,
      userId: sendNotification.reciever.id,
      sender: sendNotification.sender.id,
      isRead: false,
      data: JSON.stringify(pushNotificationData),
    });

    await notification.save();
  }

  async findUserNotifications(
    pagination: PaginationArgs,
    _id: MongooSchema.Types.ObjectId,
  ) {
    const notifications = await this.notificationModel
      .find({
        userId: _id,
      })
      .populate('sender')
      .sort({ _id: -1 });

    return await this.paginationService.paginate(notifications, pagination);
  }

  async markAsRead(ids: MarkAsReadInput) {
    const { notificationIds } = ids;

    const result = await this.notificationModel.updateMany(
      { _id: { $in: notificationIds }, isRead: false },
      { $set: { isRead: true, updatedAt: new Date() } },
    );

    return result.modifiedCount > 0;
  }
}
