import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateRoleInput {
  @IsNotEmpty()
  @Field()
  id: string;

  @Field(() => String, { nullable: true })
  role_type: string;

  @Field(() => [String], { nullable: true })
  permissionIds: string[];
}
