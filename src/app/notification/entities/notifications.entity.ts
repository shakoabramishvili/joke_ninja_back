import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Document, Schema as MongooSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Paginated } from "src/app/common/dto/pagination-result.type";
import { NotificationTypeEnum } from "src/app/shared/enum/notificationType.enum";

@ObjectType()
@Schema({ timestamps: true })
export class Notifications {
  @Field(() => ID)
  id: MongooSchema.Types.ObjectId;

  @Field(() => NotificationTypeEnum)
  @Prop({ type: String, enum: NotificationTypeEnum })
  type: NotificationTypeEnum

  @Field()
  @Prop()
  title: string;

  @Field()
  @Prop()
  message: string;

  @Field(() => ID)
  @Prop({ type: MongooSchema.Types.ObjectId })
  userId: MongooSchema.Types.ObjectId;; // who receives the notification

  @Field(() => ID, { nullable: true })
  @Prop({ nullable: true })
  senderId?: MongooSchema.Types.ObjectId;; // who triggered the notification (optional)

  @Field({ defaultValue: false })
  @Prop({ default: false })
  isRead: boolean;

  @Field(() => String, { nullable: true }) // JSON stringified or use GraphQL JSON scalar
  @Prop({ nullable: true, type: String })
  data?: Record<string, any>;

  @Field(() => Date)
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field(() => Date)
  @Prop({ default: Date.now })
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @Prop()
  deletedAt?: Date;
}

@ObjectType()
export class PaginatedNotifications extends Paginated(Notifications) {}

export type NotificationsDocument = Notifications & Document;
export const NotificationsSchema = SchemaFactory.createForClass(Notifications);
