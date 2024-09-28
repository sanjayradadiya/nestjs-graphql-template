import { registerEnumType } from '@nestjs/graphql';

export enum EntityEnum {
  LEAVE = 'leave',
  ATTENDANCE = 'attendance',
  PROFILE = 'profile',
  REPORT = 'report',
  PERMISSIONS = 'permissions',
  HOLIDAYS = 'holidays',
  EMPLOYEES = 'employees',
}
registerEnumType(EntityEnum, { name: 'EntityEnum' });
