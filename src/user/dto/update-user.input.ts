import { InputType, Field, PartialType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field()
  id: string;

  @Field({ nullable: false })
  firstName: string;

  @Field({ nullable: false })
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  password: string;

  @Field({ nullable: true })
  leaveDays: number;

  @Field({ nullable: false })
  mobileNumber: string;

  @Field({ nullable: true })
  dob: string;

  @Field({ nullable: true })
  joiningDate: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  location: string;

  @Field(() => [String], {
    nullable: true,
  })
  roleIds: string[];
}
@InputType()
export class ResetPasswordInput {
  @Field({ nullable: false })
  email: string;
  @Field({ nullable: false })
  oldPassword: string;
  @Field({ nullable: false })
  newPassword: string;
}

@InputType()
export class FirebaseInput {
  @Field({ nullable: false })
  token: string;
}

@ObjectType()
export class SuccessReturnType {
  @Field({ nullable: false })
  success: boolean;
}

@ObjectType()
export class ReturnType {
  @Field({ nullable: true })
  message: string;

  @Field({ nullable: true })
  valid: boolean;
}
