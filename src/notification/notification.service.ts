import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import {
  Repository,
  In,
} from 'typeorm';
import moment from 'moment';
import { Notification } from './entities/notification.entity';
import { NotificationList } from '../user/payloads/notifications.payload';
import { MarkReadPayload } from '../user/payloads/markRead.payload';
import { CreateNotificationInput } from './dto/create-notification-input';
@Injectable()
export class NotificationService {
  slackWebhookUrl: string;
  front_end_base_url: string;
  
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    configService: ConfigService,
  ) {
    this.slackWebhookUrl = configService.get('SLACK_WEBHOOK_URL');
    this.front_end_base_url = configService.get('FRONT_END_BASE_URL');
  }
 
  async sendingNotificationOneUser(token: string, message: string) {
    Logger.log('send check in notification reminder.....');
    const payload = {
      token,
      notification: {
        title: 'Reminder',
        body: message,
      },
      data: {
        click_action: `${this.front_end_base_url}/attendance`,
      },
    };
    return admin
      .messaging()
      .send(payload)
      .catch((err) => {
        console.log('noti err:', err);
      });
  }

  async sendingPushNotification(
    token: string,
    message: string,
    clickAction: string,
  ) {
    const payload = {
      token,
      notification: {
        title: 'Notification',
        body: message,
      },
      data: {
        click_action: clickAction,
      },
    };
    return admin
      .messaging()
      .send(payload)
      .catch((err) => {
        console.log('notification err::', err);
      });
  }

  formatTime(seconds: number) {
    const duration = moment.duration(seconds, 'seconds');
    return `${duration.hours()}:${duration.minutes()}:${duration.seconds()}`;
  }

  async createNotification(data: CreateNotificationInput) {
    const notification: Notification = new Notification();
    notification.message = data.message;
    notification.toUser = data.toUser;
    notification.fromUser = data.fromUser;
    notification.type = data.type;
    if (data.metaData) {
      notification.metadata = data.metaData;
    }

    return this.notificationRepository.save(notification);
  }

  async findNotifications(userId): Promise<NotificationList> {
    const data = await this.notificationRepository.find({
      where: {
        toUser: { id: userId },
      },
      relations: ['toUser', 'fromUser'],
    });

    const unreadCount = (
      await this.notificationRepository.find({
        where: {
          toUser: { id: userId },
          isUnread: true,
        },
      })
    ).length;

    return { data, unreadCount, success: true };
  }

  async readNotifications(
    notificationIds: string[],
    userId: string,
    markAll: boolean,
  ): Promise<MarkReadPayload> {
    try {
      if (notificationIds?.length > 0) {
        await this.notificationRepository.update(
          { id: In(notificationIds) },
          { isUnread: false },
        );
      } else if (markAll) {
        await this.notificationRepository.update(
          { toUser: { id: userId } },
          { isUnread: false },
        );
      }

      const unreadCount = await this.notificationRepository.count({
        where: {
          toUser: { id: userId },
          isUnread: true,
        },
      });

      return { unreadCount, success: true };
    } catch (error) {
      return { unreadCount: 0, success: false };
    }
  }
}
