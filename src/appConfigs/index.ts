import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JWTConstants } from 'src/common/constants/jwt.constants';

@Injectable()
export class AppConfigs {
  constructor(private service: ConfigService) {}

  get(key: string): any {
    return this.service.get(key);
  }

  jwtAuthSecret(): string {
    const authSecret = JWTConstants.secret;

    if (!authSecret) {
      throw new Error(`auth jwt token not found ${__filename}`);
    }

    return authSecret;
  }

  staffRoleId(): string {
    const staffRoleId = this.get('STAFF_ROLE_ID');

    if (!staffRoleId) {
      throw new Error(`Staff role id not provided ${__filename}`);
    }

    return staffRoleId;
  }

  adminRoleId(): string {
    const adminRoleId = this.get('ADMIN_ROLE_ID');

    if (!adminRoleId) {
      throw new Error(`Admin role id not provided ${__filename}`);
    }

    return adminRoleId;
  }

  superAdminRoleId(): string {
    const superAdminRoleId = this.get('SUPER_ADMIN_ROLE_ID');

    if (!superAdminRoleId) {
      throw new Error(`Super Admin role id not provided ${__filename}`);
    }

    return superAdminRoleId;
  }
}
