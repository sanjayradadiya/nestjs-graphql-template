import { Role } from '../../role/entities/role.entity';
import { EntityBaseSchema } from '../entity/schemas/entityBase';

export enum UserStatusEnum {
  DELETED = 'deleted',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EMAIL_NOT_VERIFIED = 'emailNotVerified',
  INVITED = 'invited',
  SYSTEM = 'system',
}
export declare class ScopedRole {
  roleId: string;
}
export declare class UserSchema extends EntityBaseSchema {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  profilePicture?: string;
  userTimeZone?: string;
  status: UserStatusEnum;
  scopedRoles: Array<Role>;
  lastLogin?: Date | string;
  deletedAt?: Date | string;
  deactivatedAt?: Date | string;
  createdById: string;
  updatedById: string;
  emailVerified: boolean;
  isPasswordResetLinkSent?: boolean;
  deletedById?: string;
  get name(): string;
  success?: boolean;
  message: string;
  permissions: any;
}
