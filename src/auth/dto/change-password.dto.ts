import { IsNotEmpty } from 'class-validator';

/**
 * This is dto class which contains values that needs to be provided while changing password
 */
export class ChangePasswordDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  new_password: string;
}
