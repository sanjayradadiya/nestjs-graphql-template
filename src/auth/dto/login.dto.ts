import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsEmail, IsIn, IsOptional } from 'class-validator';

/**
 * This is dto class which contains values that needs to be provided while logging into system
 */
@InputType()
export class LoginDto {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class LoginTokenType {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@ObjectType()
export class LoginSuccessReturn {
  @Field()
  success: boolean;

  @Field(() => LoginTokenType)
  loginToken: LoginTokenType;
}

@ObjectType()
export class RefreshResponse {
  @Field() 
  token: string;
}

@ObjectType()
export class SendTestEmailResponse {
  @Field() 
  success: boolean;
}
