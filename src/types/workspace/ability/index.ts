import { UserContext } from 'src/types/user/utilities';
import { WorkspaceActionsEnum, WorkspaceSubjectsEnum } from '../enums';
export declare type GenericPermissionType<T> = {
  [key in keyof T]?: T[key];
};
export interface AbilityProps<T> {
  userContext: UserContext;
  permission: GenericPermissionType<T>;
  /** For entities where permission should be governed by permissions on a different entity */
  entityTypes?: string[];
  byPass?: boolean;
}

export declare type WorkspacePermissions = {
  [WorkspaceSubjectsEnum.WORKSPACE]: WorkspaceActionsEnum.READ;
};
export declare type WorkspacePermission =
  GenericPermissionType<WorkspacePermissions>;
export declare type WorkspaceAbilityProps = AbilityProps<WorkspacePermission>;
