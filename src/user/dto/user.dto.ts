import { Role } from '../../role/entities/role.entity';
import { UserStatusEnum } from '../../types/user/user';

export class UserDto {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  password: string;

  mobileNumber: string;

  dob: string;

  status: UserStatusEnum;

  profilePicture?: string;

  userTimeZone?: string;

  scopedRoles: Role[];

  lastLogin?: Date | string;

  deletedAt?: Date | string;

  deactivatedAt?: Date | string;

  createdById: string;

  updatedById: string;

  emailVerified: boolean;

  isPasswordResetLinkSent?: boolean;

  deletedById?: string;
}
