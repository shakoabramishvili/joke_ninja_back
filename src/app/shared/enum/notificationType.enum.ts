import { registerEnumType } from "@nestjs/graphql";

export enum NotificationTypeEnum {
  FOLLOW = 'follow',
  CREATE_JOKE = 'create_joke',
}

registerEnumType(NotificationTypeEnum, {
    name: "NotificationTypeEnum",
    description: "NotificationTypeEnum",
});