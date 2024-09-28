import { CreateConfigurationInput } from './create-configuration.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateConfigurationInput extends PartialType(
  CreateConfigurationInput,
) {
  @Field(() => String)
  id: string;
}
