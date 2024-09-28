import { IsNotEmpty } from 'class-validator';

/**
 * This is dto class which contains values that needs to be provided while resetting password with otp
 */
export class ResetPasswordDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  token: string;
}
