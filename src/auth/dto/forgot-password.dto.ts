import { Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * This is dto class which contains values that needs to be provided while forgot password flow
 */
export class ForgotPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}


@ObjectType()
export class ForgotPasswordResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message: string;
}