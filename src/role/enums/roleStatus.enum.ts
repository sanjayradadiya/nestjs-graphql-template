import { registerEnumType } from '@nestjs/graphql';

export enum RoleStatusEnum {
  ACTIVE = 'active',
  DELETED = 'deleted',
}
registerEnumType(RoleStatusEnum, { name: 'RoleStatusEnum' });
