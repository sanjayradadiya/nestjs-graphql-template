import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateRoleInput {
  @IsNotEmpty()
  @Field()
  role_type: string;
}

@ObjectType()
export class ReturnCreateRole {
  @Field({ nullable: false })
  message: string;

  @Field({ nullable: false })
  valid: false;
}
