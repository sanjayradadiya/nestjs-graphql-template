import { StringObjectID } from 'src/types/common';
import { EntityBaseSchema } from 'src/types/entity/schemas/entityBase';
import { UserSchema } from '../../types/user/user';

export type CreateUserRepositoryInputType = Omit<
  UserSchema,
  keyof Omit<EntityBaseSchema, '_id' | 'permissions'> | 'name'
>;

export type UpdateUserRepositoryInputType = Partial<
  Omit<UserSchema, 'tenantId' | 'createdById'>
>;

export type RemoveScopeGroupIdForRoleIdFromAllExcludedUsersRepositoryInput = {
  userIds: StringObjectID[];
  roleId: StringObjectID;
  scopeGroupId: StringObjectID[];
};

export interface LoginTokenPayload {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterUserInput {
  emailId: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface RegisterUserPayload {
  success: boolean;
  loginToken: LoginTokenPayload;
}

export interface ValidateRegisterUserPayload {
  tenantId: string;
}

export type LoginUserInput = RegisterUserInput;
export type LoginUserPayload = RegisterUserPayload;

export type SwitchTenantInput = {
  tenantId: StringObjectID;
};

export interface ForgotPasswordInput {
  emailId: string;
}

export interface SetPasswordInput {
  token: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface VerifySetPasswordInput {
  token: string;
}
