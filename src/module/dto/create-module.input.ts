import { InputType, Field } from '@nestjs/graphql';
import { EntityEnum } from '../enums/module.enum';

@InputType()
export class CreateModuleInput {
  @Field(() => EntityEnum)
  module: EntityEnum;
}
