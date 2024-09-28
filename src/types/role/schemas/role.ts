import { EntityBaseSchema } from 'src/types/entity/schemas/entityBase';
import { AllowedPermissionsEntityEnum } from 'src/types/workspace';
import { ApplicableOnEnum, RoleStatusEnum, RoleTypeEnum } from '../enums';

export declare class PermittedOnSchema {
  permissions: string[];
  entity: AllowedPermissionsEntityEnum;
}
export declare class RoleMetadataSchema {
  configuredPermissions: string[];
}

export declare class RoleSchema extends EntityBaseSchema {
  name: string;
  type: RoleTypeEnum;
  permittedOn: PermittedOnSchema[];
  applicableOn: ApplicableOnEnum[];
  metadata: RoleMetadataSchema;
  description?: string;
  tenantId?: string;
  status: RoleStatusEnum;
  createdById: string;
  updatedById: string;
  deletedAt?: Date | string;
  deletedById?: string;
  /** Won't be used. Only for the purpose of fetching distinct values of permissions in multiple roles. */
  'permittedOn.permissions'?: string[];
}
