export interface UserRolePermissionType {
  userId: string;
  roleId: string;
}
export interface ScopeGroupRolePermissionType {
  scopeGroupId: string;
  roleId: string;
}
/** Date: 30th May 2022: This case will not be handled but kept if needed in future. */
export interface RolePermissionType {
  roleId: string;
}
export declare type PermissionTypesUnionType =
  | UserRolePermissionType
  | RolePermissionType;
