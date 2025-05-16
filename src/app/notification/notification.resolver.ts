import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Notifications, PaginatedNotifications } from "./entities/notifications.entity";
import { NotificationService } from "./notification.service";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../shared/guards/jwt-auth.gards";
import { PaginationArgs } from "../common/dto/get-paginated.args";
import { Schema as MongooSchema } from 'mongoose';
import { MarkAsReadInput } from "./dto/mark-as-read.input";

@Resolver(() => Notifications)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedNotifications, { name: 'userNotifications' })
  findUserNotifications(
    @Args() args: PaginationArgs,
    @Args('id', { type: () => ID }) id: MongooSchema.Types.ObjectId,
  ) {

    return this.notificationService.findUserNotifications(args, id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, { name: 'MarkAsReadInput' })
  markNotificationAsRead(
    @Args('MarkAsReadInput') markAsRead: MarkAsReadInput,
  ) {
      return this.notificationService.markAsRead(markAsRead);
  }
}