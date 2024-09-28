import { Field, InputType } from '@nestjs/graphql';
import { RoleStatusEnum } from '../enums/roleStatus.enum';

@InputType()
export class RoleFilters {
  @Field(() => String, { nullable: true })
  id?: string;
  @Field(() => String, { nullable: true })
  role_type?: string;
  @Field(() => RoleStatusEnum, {
    nullable: true,
  })
  status?: RoleStatusEnum;
}
