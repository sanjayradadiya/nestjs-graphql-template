import { Field, ObjectType } from '@nestjs/graphql';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Notification } from '../../notification/entities/notification.entity';
import { QueryResponse } from '../../payloads/queryResponse';

@ObjectType('notificationList')
export class NotificationList extends QueryResponse {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => [Notification], { nullable: true })
  data: Notification[];

  @Field({ defaultValue: 0 })
  unreadCount: number;
}
