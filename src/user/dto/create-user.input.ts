import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserStatusEnum } from '../types/enum';

@InputType()
export class CreateUserInput {
  @Field({ nullable: true })
  firstName: string;

  @Field({ nullable: true })
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  password: string;

  @Field({ nullable: true })
  mobileNumber: string;

  @Field({ nullable: true })
  dob: string;

  @Field({ nullable: true })
  joiningDate: string;

  @IsNotEmpty()
  @Field(() => [String], {
    nullable: false,
  })
  roleIds: string[];

  @Field(() => UserStatusEnum, {
    defaultValue: UserStatusEnum.EMAIL_NOT_VERIFIED,
    nullable: true,
  })
  status: UserStatusEnum;
}
@ObjectType()
export class CreateUserReturnType {
  @Field({ nullable: true })
  valid: boolean;

  @Field({ nullable: true })
  message: string;
}
