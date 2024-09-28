import { registerEnumType } from '@nestjs/graphql';

export enum AllowedPermissionActionsEnum {
  /** User actions */
  ACCESS = 'access',
  RESET = 'reset',
  ACCESS_REPORT = 'access_report',
  CREATE = 'create',
  DELETE = 'delete',
  EDIT = 'edit',
  LIST = 'list',
  MANAGE = 'manage',
  READ = 'read',
  RESET_PASSWORD = 'resetPassword',
  RESTORE = 'restore',
  APPROVE = 'approve',
  DECLINE = 'decline',
}

registerEnumType(AllowedPermissionActionsEnum, {
  name: 'AllowedPermissionActionsEnum',
});
