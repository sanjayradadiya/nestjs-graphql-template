import {
  AllowedPermissionActionsEnum,
  AllowedPermissionsEntityEnum,
  AllowedPermissionsSubjectEnum,
} from '../enums';
declare class PermissionDependency {
  dependentOn: string[];
}
export declare class AllowedEntityPermissions extends PermissionDependency {
  key: string;
  entity: AllowedPermissionsEntityEnum;
  subject: AllowedPermissionsSubjectEnum;
  actions: AllowedPermissionActionsEnum[];
  eitherOfDependentOn?: PermissionDependency[];
  label: string;
  defaultEnabled: boolean;
  disabled?: boolean;
}
export declare class EntityPermissionsMap {
  key: string;
  entityPermissions: AllowedEntityPermissions[];
  hidden: boolean;
  label: string;
  icon?: string;
}
export {};
