import { registerEnumType } from '@nestjs/graphql';

export enum UserStatusEnum {
  DELETED = 'deleted',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EMAIL_NOT_VERIFIED = 'emailNotVerified',
  INVITED = 'invited',
  SYSTEM = 'system',
}

registerEnumType(UserStatusEnum, { name: 'UserStatusEnum' });
