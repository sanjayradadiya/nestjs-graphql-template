import { RoleActionsEnum, RoleSubjectsEnum } from '..';

export declare type GenericPermissionType<T> = {
  [key in keyof T]?: T[key];
};

export declare type RolePermissions = {
  [RoleSubjectsEnum.ROLE]:
    | RoleActionsEnum.CREATE
    | RoleActionsEnum.EDIT
    | RoleActionsEnum.READ
    | RoleActionsEnum.DELETE;
};

export declare type RolePermission = GenericPermissionType<RolePermissions>;
