import { Role } from '../../role/entities/role.entity';
import { UserStatusEnum } from './user';

export declare type CurrentUserInfo = {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatusEnum;
  scopedRoles: Role[];
  timezone?: string;
};
export declare type TenantType = {
  id: string;
  name: string;
};
/** NOTE: If you add a new field or rename a field, remember update pick array in grpcMetadata.ts file in utils folder of this repository. */
export interface UserContext {
  currentUserInfo: CurrentUserInfo;
  requestId?: string;
  requestTimestamp: string;
}
export interface UnAuthUserContext {
  currentUserInfo?: CurrentUserInfo;
  requestId?: string;
  requestTimestamp: string;
}
export declare type PartialRecord<
  K extends keyof Record<string, unknown>,
  T,
> = Partial<Record<K, T>>;
interface UserMetadata {
  first_name: string;
  last_name: string;
  user_id: number;
  photo_url: string | null;
  is_active: number;
}
export interface ValidateSessionResponseType {
  iss: string;
  iat: number;
  exp: number;
  nbf: number;
  jti: string;
  email: string;
  sub: string;
  user_id: number;
  tenant_id: number;
  tenant_code: string;
  tenant_name: string;
  site_id: number;
  is_email_confirmation_pending: boolean;
  new_email?: string | null;
  user_time_zone?: string | null;
  permissions: string[];
  role_id: string;
  role_name: string;
  user_metadata: UserMetadata;
  user_private_key: string;
  tenants?: TenantType[];
}

export {};
