import { InputType, Field } from '@nestjs/graphql';
import { EntityEnum } from 'src/module/enums/module.enum';
import { AllowedPermissionActionsEnum } from '../enums/allowedPermissionActions.enum';

@InputType()
export class CreatePermissionInput {
  @Field(() => String, { nullable: false })
  label: string;

  @Field(() => EntityEnum)
  module: EntityEnum;

  @Field(() => AllowedPermissionActionsEnum, { nullable: false })
  action: AllowedPermissionActionsEnum;

  @Field(() => String)
  key: string;
}
