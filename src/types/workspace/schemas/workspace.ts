import { EntityBaseSchema } from 'src/types/entity/schemas/entityBase';
import { EntityPermissionsMap } from './entityPermissionsMap';
export declare class WorkspaceSchema extends EntityBaseSchema {
  allowedEntityPermissionsMap: EntityPermissionsMap[];
}
