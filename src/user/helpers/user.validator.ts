import { UserSchema, UserStatusEnum } from '../../types/user/user';
import { UserContext } from 'src/types/user/utilities';
import { CreateUserInput } from '../dto/create-user.input';
import { UserDto } from '../dto/user.dto';
import { UserService } from '../user.service';
import { PasswordManagerHelperClass } from './passwordManager.helper';
import { TokenManagerHelperClass } from './tokenManager.helper';
import { differenceBy } from 'lodash';
import {
  ForgotPasswordInput,
  LoginUserInput,
  VerifySetPasswordInput,
} from 'src/types/auth/input';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserValidatorsHelperClass {
  private userService: UserService;
  private configService: ConfigService;
  constructor(
    private TokenManagerHelper: TokenManagerHelperClass,
    private PasswordManagerHelper: PasswordManagerHelperClass,
  ) {}

  async validateCreateUserInput(
    input: CreateUserInput,
    existingUser?: UserSchema,
  ): Promise<void> {
    /* if user is not present then the input is valid */
    if (!existingUser) {
      return;
    }

    const { status } = existingUser;

    /* if status is archived, then return appropriate errorCode */
    if (status === UserStatusEnum.DELETED) {
      throw new Error(
        `User already exists but in deleted status: ${existingUser.id} ${__filename} - ${this.validateCreateUserInput.name}`,
      );
    }

    throw new Error('A user with this email address is already registered.');
  }

  async validateUpdateUserInput(
    input: Partial<UserDto>,
    userContext: UserContext,
    existingUser?: UserSchema,
  ): Promise<void> {
    const { id, scopedRoles: incomingScopedRoles, email } = input;

    /* if user is not present then the input is valid */
    if (!existingUser) {
      throw new Error(
        `User not found: ${id} ${__filename} - ${this.validateUpdateUserInput.name}`,
      );
    }

    const { status, scopedRoles: existingScopedRoles } = existingUser;

    /* if status is archived, then return appropriate errorCode */
    if (status === UserStatusEnum.DELETED) {
      throw new Error(
        `User deleted: ${id} ${__filename} - ${this.validateUpdateUserInput.name}`,
      );
    }

    if (
      userContext &&
      !(userContext.currentUserInfo?.scopedRoles || []).some(
        ({ id }) =>
          id.toString() === this.configService.get('SUPER_ADMIN_ROLE_ID'),
      )
    ) {
      const newScopedRolesAssigned = differenceBy(
        incomingScopedRoles,
        existingScopedRoles,
        (scopedRole) => scopedRole.id.toString(),
      );
      if (
        newScopedRolesAssigned.some(
          ({ id }) =>
            id.toString() === this.configService.get('SUPER_ADMIN_ROLE_ID'),
        )
      ) {
        throw new Error(
          `Non Super Admin user is trying to assign super admin role to another user. ${__filename} - ${this.validateUpdateUserInput.name}`,
        );
      }
    }

    if (email && email !== existingUser.email) {
      const user = await this.userService.findUserByEmail(email);
      if (user) {
        throw new Error(
          `User with new email already exists ${__filename} - ${this.validateUpdateUserInput.name}`,
        );
      }
    }
  }

  async validateLoginUser(
    input: LoginUserInput,
    existingUser?: UserSchema,
  ): Promise<Partial<UserSchema>> {
    try {
      const { password } = input;
      if (!existingUser) {
        return {
          success: false,
          message: `We can't find that email and password.`,
        };
      }

      /* if user is not present then the input is valid */
      if (existingUser) {
        const isPasswordCorrect =
          await this.PasswordManagerHelper.comparePassword({
            password,
            user: existingUser,
          });
        /* compare password */
        if (!isPasswordCorrect) {
          /* password reset after the migration */
          if (
            typeof existingUser.isPasswordResetLinkSent === 'boolean' &&
            !existingUser.isPasswordResetLinkSent
          ) {
            /* create user verification token */
            const temporaryUserContext: Partial<UserContext> = {
              currentUserInfo: {
                ...(existingUser as UserSchema),
                email: existingUser.email,
              },
              requestTimestamp: new Date().toISOString(),
            };

            await this.userService.updateUser(
              existingUser.id,
              temporaryUserContext as unknown as User,
            );
            return {
              success: false,
              message: `Hris has been updated and upgraded to give you a much better experience and to improve security. Part of the security upgrade requires you to reset your password. Please check your email inbox for the email from Hris to reset your password. Thank you for using Hris.`,
            };
          }
          return {
            success: false,
            message:
              "We can't find that email and password. You can reset your password or try again.",
          };
        }

        if (existingUser.status === UserStatusEnum.EMAIL_NOT_VERIFIED) {
          return {
            success: false,
            message: `Please click on the link sent to your inbox to verify your email and set your password.`,
          };
        }
        if (existingUser.status === UserStatusEnum.INACTIVE) {
          return {
            success: false,
            message: `Please contact your admin to activate your account.`,
          };
        }

        /* if status is delete, then return appropriate errorCode */
        const { status } = existingUser;
        if (status === UserStatusEnum.DELETED) {
          return {
            success: false,
            message: `Your account is deactivated. Please contact your administrator.`,
          };
        }

        const isResetPassword =
          await this.PasswordManagerHelper.comparePassword({
            password: 'Welcome@1234',
            user: existingUser,
          });
        if (isResetPassword) {
          return {
            success: false,
            message: 'First you need to reset your password.',
          };
        }
      }
      return { ...existingUser, success: true, message: 'successfully login!' };
    } catch (error) {
      throw error;
    }
  }

  validateForgotPasswordUser({
    user,
    forgotPasswordInput,
  }: {
    user?: UserSchema | null;
    forgotPasswordInput: ForgotPasswordInput;
  }): UserSchema {
    try {
      const { email } = forgotPasswordInput;
      if (!user) {
        throw new Error(`User with emailId ${email} does not exists`);
      }

      const { status } = user;
      const allowedUserStatuses = [
        UserStatusEnum.ACTIVE,
        UserStatusEnum.EMAIL_NOT_VERIFIED,
      ];

      if (!allowedUserStatuses.includes(status)) {
        throw new Error(
          `User with emailId: ${email} can't forgotPassword, as status of user is not correct, ${status}`,
        );
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async validateSetPasswordInput(
    input: VerifySetPasswordInput,
  ): Promise<Partial<UserSchema>> {
    try {
      const { token } = input;

      const user = await this.TokenManagerHelper.validateSetPasswordToken(
        token,
      );

      return user;
    } catch (error) {
      throw error;
    }
  }
}
