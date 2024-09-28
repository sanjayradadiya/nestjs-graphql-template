import { registerEnumType } from '@nestjs/graphql';

export enum NotificationTypeEnum {
  LEAVE = 'LEAVE',
  LEAVE_APPROVE = 'LEAVE_APPROVE',
  ATTENDANCE = 'ATTENDANCE',
  ATTENDANCE_APPROVE = 'ATTENDANCE_APPROVE',
}

registerEnumType(NotificationTypeEnum, { name: 'NotificationTypeEnum' });
