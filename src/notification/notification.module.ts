import { forwardRef, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HttpModule } from '@nestjs/axios';
import { MailModule } from 'src/mail/mail.module';
import { Notification } from './entities/notification.entity';
import { NotificationResolver } from './notification.resolver';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Notification]),
    HttpModule,
    MailModule,
    forwardRef(() => UserModule),
  ],
  providers: [NotificationService, NotificationResolver],
  exports: [NotificationService],
})
export class NotificationModule {}
