import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user.service';
import { UserSchema, UserStatusEnum } from '../../types/user/user';
import {
  AccessTokenPayload,
  CreateLoginTokenInput,
  ForgotPasswordTokenPayload,
  GenerateTokenInput,
  RefreshTokenPayload,
  TokenPayload,
  TokenUsageEnum,
  UserInvitationTokenPayload,
  UserVerificationTokenPayload,
} from '../types/token.interface';
import { LoginTokenPayload } from 'src/types/auth/payload/login';
import { AppConfigs } from 'src/appConfigs';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JWTConstants } from '../../common/constants';

@Injectable()
export class TokenManagerHelperClass {
  private jwtSecret!: string;
  //private appConfig: AppConfigs;
  constructor(
    private appConfig: AppConfigs,
    private jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {
    this.setJwtSecret();
  }

  private setJwtSecret(): void {
    this.jwtSecret = this.appConfig.jwtAuthSecret();
  }

  private validateToken(token: string): TokenPayload {
    try {
      // const payload = jwt.verify(token, this.jwtSecret);
      const payload = this.jwtService.verify(token, {
        secret: JWTConstants.secret,
      });
      return payload as TokenPayload;
    } catch (error) {
      throw error;
    }
  }

  private generateToken({
    payload,
    expiresInHours,
  }: GenerateTokenInput): string {
    return this.jwtService.sign(payload, {
      secret: JWTConstants.secret,
      expiresIn: `${expiresInHours}h`,
    });
  }

  private createRefreshToken(input: RefreshTokenPayload): string {
    return this.generateToken({ payload: input, expiresInHours: 24 * 30 });
  }

  private createAccessToken(input: AccessTokenPayload): string {
    return this.generateToken({ payload: input, expiresInHours: 12 });
  }

  createUserVerificationToken(input: UserVerificationTokenPayload): string {
    return this.generateToken({ payload: input, expiresInHours: 24 * 7 });
  }

  createUserInvitationToken(input: UserInvitationTokenPayload): string {
    return this.generateToken({ payload: input, expiresInHours: 24 * 7 });
  }

  createForgotPasswordToken(input: ForgotPasswordTokenPayload): string {
    return this.generateToken({ payload: input, expiresInHours: 24 });
  }

  createLoginToken(input: CreateLoginTokenInput): LoginTokenPayload {
    const { email, userId } = input;

    const accessToken = this.createAccessToken({
      email,
      tokenUse: TokenUsageEnum.ACCESS,
      userId,
    });
    const refreshToken = this.createRefreshToken({
      tokenUse: TokenUsageEnum.REFRESH,
      userId,
    });

    return { accessToken, refreshToken };
  }

  private async validateTokenUser(
    tokenPayload: any,
  ): Promise<Partial<UserSchema>> {
    try {
      const { email } = tokenPayload;
      // system user and current user can be of different tenant
      const user = await this.userService.findUserByEmail(email);

      if (!user) {
        throw new Error(
          `No user exists for ${email} email in the token payload! ${__filename} - ${this.validateTokenUser.name}`,
        );
      }

      const { status } = user;
      if (status === UserStatusEnum.DELETED) {
        throw new Error(
          `User ${email} is deleted! ${__filename} - ${this.validateTokenUser.name}`,
        );
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async validateRefreshToken(
    refreshToken: string,
  ): Promise<{ user: Partial<UserSchema>; tokenPayload: TokenPayload }> {
    try {
      const tokenPayload = this.validateToken(refreshToken);
      const { tokenUse } = tokenPayload;

      /** Check whether token is refresh token or not */
      if (tokenUse !== TokenUsageEnum.REFRESH) {
        throw new Error(
          `Token is not a refresh token ${__filename} - ${this.validateRefreshToken.name}`,
        );
      }

      /** Validate user inside refresh token */
      const user = await this.validateTokenUser(tokenPayload);

      return { user, tokenPayload };
    } catch (error) {
      throw error;
    }
  }

  async validateVerificationToken(
    verificationToken: string,
  ): Promise<{ user: Partial<UserSchema>; tokenPayload: TokenPayload }> {
    try {
      const tokenPayload = this.validateToken(verificationToken);
      const { tokenUse } = tokenPayload;

      /** Check whether token is verification token or not */
      if (
        tokenUse !== TokenUsageEnum.VERIFY &&
        tokenUse !== TokenUsageEnum.INVITE
      ) {
        throw new Error(
          `Token is not a verification token ${__filename} - ${this.validateVerificationToken.name}`,
        );
      }

      /** Validate user inside refresh token */
      const user = await this.validateTokenUser(tokenPayload);

      return { user, tokenPayload };
    } catch (error) {
      throw error;
    }
  }

  async validateSetPasswordToken(token: string): Promise<Partial<UserSchema>> {
    try {
      const tokenPayload = this.validateToken(token);
      const { tokenUse } = tokenPayload;
      /** Check whether token is forgotPassword token or not */
      if (
        tokenUse !== TokenUsageEnum.FORGOT_PASSWORD &&
        tokenUse !== TokenUsageEnum.INVITE
      ) {
        throw new Error(
          `Token is not a forgot password/invite token ${__filename} - ${this.validateSetPasswordToken.name}`,
        );
      }

      /** Validate user inside refresh token */
      const user = await this.validateTokenUser(tokenPayload);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async validateUpdateLeaveStatusToken(token: string): Promise<any> {
    try {
      const tokenPayload = this.validateToken(token);

      const user = await this.validateTokenUser(tokenPayload);

      return { user, token: tokenPayload };
    } catch (error) {
      throw error;
    }
  }
}

// export const TokenManagerHelper = new TokenManagerHelperClass();
