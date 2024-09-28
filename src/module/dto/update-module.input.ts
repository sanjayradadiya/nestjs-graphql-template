import { EntityEnum } from '../enums/module.enum';
import { CreateModuleInput } from './create-module.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateModuleInput extends PartialType(CreateModuleInput) {
  @Field(() => String)
  id: string;

  @Field(() => EntityEnum)
  module: EntityEnum;
}
