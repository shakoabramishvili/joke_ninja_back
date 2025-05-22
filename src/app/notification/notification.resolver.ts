import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Notifications, PaginatedNotifications } from "./entities/notifications.entity";
import { NotificationService } from "./notification.service";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../shared/guards/jwt-auth.gards";
import { PaginationArgs } from "../common/dto/get-paginated.args";
import { Schema as MongooSchema } from 'mongoose';
import { MarkAsReadInput } from "./dto/mark-as-read.input";
import { GetUser } from "../shared/decorators/current-user.decorator";
import { User } from "../user/entities/user.entity";

@Resolver(() => Notifications)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedNotifications, { name: 'userNotifications' })
  findUserNotifications(
    @Args() args: PaginationArgs,
    @GetUser() user: User,
  ) {

    return this.notificationService.findUserNotifications(args, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { name: 'MarkAsReadInput' })
  markNotificationAsRead(
    @Args('MarkAsReadInput') markAsRead: MarkAsReadInput,
  ) {
      return this.notificationService.markAsRead(markAsRead);
  }
}