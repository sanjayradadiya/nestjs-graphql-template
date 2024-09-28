/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import moment from 'moment';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginSuccess } from './types';
import * as RandToken from 'rand-token';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { MailService } from 'src/mail/mail.service';
import { LoginDto, LoginSuccessReturn } from './dto/login.dto';
import { ForgotPasswordDto, ForgotPasswordResponse } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/set-password.dto';
import { CryptoService } from '../common/providers/crypto.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserSchema, UserStatusEnum } from '../types/user/user';
import { UserValidatorsHelperClass } from 'src/user/helpers/user.validator';
import { TokenManagerHelperClass } from 'src/user/helpers/tokenManager.helper';
import { RefreshUserTokenInput } from '../user/types/token.interface';
import { LoginTokenPayload } from '../user/types/user.interface';
import { InternalServerError } from '../common/errors';
import { JWTConstants } from 'src/common/constants/jwt.constants';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private mailService: MailService,
    private cryptoService: CryptoService,
    private userValidatorHelper: UserValidatorsHelperClass,
    private TokenManagerHelper: TokenManagerHelperClass
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email);
    const userD = await this.userValidatorHelper.validateLoginUser(
      { email, password },
      user as unknown as UserSchema
    );
    if (userD) {
      return userD;
    }
    return null;
  }

  async refreshUserToken(
    input: RefreshUserTokenInput
  ): Promise<LoginTokenPayload> {
    try {
      const { refreshToken } = input;

      /** Verify refresh token */
      const { user, tokenPayload } =
        await this.TokenManagerHelper.validateRefreshToken(refreshToken);

      const { id: userId, email } = user;

      /** create the login token */
      const loginTokenPayload = this.TokenManagerHelper.createLoginToken({
        email,
        userId: userId.toString(),
      });

      return loginTokenPayload;
    } catch (error: any) {
      throw new InternalServerError({
        message: `Failed to refreshUserToken ${error.message}`,
        where: `${__filename} - ${this.refreshUserToken.name}`,
      });
    }
  }

  /**
   * This method is used to login the user.
   * It will verify email and password. Once verified, it will generate jwt token and refresh token so that user can access other apis
   *
   * @param user
   */
  async login(user: LoginDto): Promise<LoginSuccessReturn> {
    const userData = await this.userService.findUserByEmail(user.email);

    const loginTokens = this.TokenManagerHelper.createLoginToken({
      email: userData.email,
      userId: userData.id.toString(),
    });
    await this.userService.loginStatus(userData.id, true);
    return {
      success: true,
      loginToken: {
        accessToken: loginTokens.accessToken,
        refreshToken: loginTokens.refreshToken,
      },
    };
  }

  async loginByLink(user: any): Promise<LoginSuccess> {
    try {
      const payload = await this.jwtService.verify(user.token, {
        secret: JWTConstants.secret,
      });

      if (typeof payload === "object" && "email" in payload) {
        // Fetching user by email address from database
        const userData = await this.userService.findUserByEmail(payload.email);
        this.userService.updateUser(userData.id, {
          password: user.password,
          status: UserStatusEnum.ACTIVE,
        });
        // We are generating new refresh token each time when user logs in so that old refresh token will get invalid
        const refreshToken = await this.generateRefreshToken(userData.id);
        return {
          success: true,
          loginToken: { accessToken: refreshToken, refreshToken },
        };
        // return {
        //   message: 'Login successfully',
        //   data: {
        //     id: userData.id,
        //     name: `${userData.firstName || ''} ${userData.lastName || ''}`,
        //     email: userData.email,
        //     refresh_token: refreshToken,
        //     access_token: this._getJWTToken(
        //       this._getJwtPayload(userData.id, userData.email, refreshToken),
        //     ),
        //   },
        // };
      }
    } catch (error) {
      if (error?.name === "TokenExpiredError") {
        throw new BadRequestException("Email confirmation token expired");
      }
      throw new BadRequestException("Bad confirmation token");
    }
  }

  /**
   * This method is used to generate otp for forgot password functionality
   *
   * @param forgotPassword
   */
  async forgotPassword(
    forgotPassword: ForgotPasswordDto
  ): Promise<ForgotPasswordResponse> {
    // Fetching user by provided email address from database
    const userData = await this.userService.findUserByEmail(
      forgotPassword.email
    );

    // If no matching user then show error
    if (!userData) {
      throw new BadRequestException("User does not exist");
    }
    //await this.userService.saveUser(userData);

    // Sending Email for forgot password
    await this.mailService.sendForgotPasswordEmail(userData);

    return {
      success: true,
      message: "Email sent successfully",
    };
  }

  /**
   * This method is used to reset the password during forgot password flow
   *
   * @param resetPasswordDto
   */
  async resetPassword(req: any): Promise<{ message: string }> {
    // Fetching user by provided email address from database
    const userData = await this.userService.setPassword(req);
    // If no matching user then show error
    if (!userData) {
      throw new BadRequestException("User does not exist");
    }

    return {
      message: "Password reset successfully",
    };
  }

  /**
   * This method is used to generate otp for forgot password functionality
   *
   * @param emailAddress
   */
  async sendTestEmail(emailAddress: string): Promise<void> {
    // Sending OTP Email for forgot password
    await this.mailService.sendTestMail(emailAddress);
  }

  /**
   * This method is used to change the user password
   *
   * @param loggedInUser
   * @param changePasswordDto
   */
  async changePassword(
    loggedInUser: User,
    changePasswordDto: ChangePasswordDto
  ): Promise<{ message: string }> {
    // Fetching user by user id from database
    const user = await this.userService.findUserById(loggedInUser.id);

    // Checking current password matches or not
    if (
      !this.cryptoService.validatePassword(
        changePasswordDto.password,
        user.password
      )
    ) {
      throw new BadRequestException("Your password is incorrect");
    }

    // Checking new password is same as current password
    if (
      this.cryptoService.validatePassword(
        changePasswordDto.new_password,
        user.password
      )
    ) {
      throw new BadRequestException("You can not change to same password");
    }

    // Encrypting new password and set it to user account
    user.password = this.cryptoService.getPasswordHash(
      changePasswordDto.new_password
    );
    await this.userService.saveUser(user);

    return {
      message: "Password changed successfully",
    };
  }

  /**
   * This is private method which is used to generate jwt token from jwt payload.
   * It will be used while register, login and refresh token.
   *
   * @param tokenData
   * @private
   */
  private _getJWTToken(tokenData: JwtPayload): string {
    return this.jwtService.sign(tokenData);
  }

  /**
   * This is private method which is used to prepare jwt token payload from user data, which then uses to generate the jwt token.
   * So If we have jwt token then we can identify that it is associated to which user account.
   *
   * @param uuid
   * @param username
   * @param type
   * @param refreshToken
   * @private
   */
  private _getJwtPayload(
    uuid: string,
    username: string,
    refreshToken: string
  ): JwtPayload {
    // Setting user id, username, type and refresh token as jwt payload
    const jwtPayload: JwtPayload = {
      userId: uuid,
      username: username,
      refresh_token: refreshToken,
    };
    return jwtPayload;
  }

  async generateRefreshToken(userId): Promise<string> {
    // Generating unique alphanumeric string of length 16 characters as refresh token
    const refreshToken = RandToken.generate(16);
    /*
      Setting refresh token expiry. By default, generated refresh token will be valid for 6 days, though we can configure it and change this duration by
      setting up "REFRESH_TOKEN_EXPIRY_TIMEOUT_IN_MINUTES" env variable. We need to specify its value in minutes like REFRESH_TOKEN_EXPIRY_TIMEOUT_IN_MINUTES=1440 for 1 day
     */
    const expiryDate = moment(new Date())
      .add(
        this.configService.get<string>("refreshTokenExpiryTimeoutInMinutes"),
        "minutes"
      )
      .valueOf();

    await this.userService.updateUser(userId, {
      refreshToken: refreshToken,
      refreshTokenExpiry: expiryDate,
    });
    return refreshToken;
  }

  /**
   * This method is used to verify jwt token payload.
   *
   * @param payload
   */
  async validateJwtToken(payload: JwtPayload): Promise<Partial<User>> {
    // Fetching user by id, that we extracted from jwt token, from database
    const user = await this.userService.findUserById(payload.userId);

    /*
      If we dont find the matching the matching user that means its not a valid token payload
      If user's refresh_token does not match with payload refresh_token then we consider it as unauthorised user. This happens when 2 person, login into 2 devices with same account
      so when 2nd person login using same account, we invalid the 1st user i.e. 1st user will be logged out automatically
     */
    // if (!user || payload.refresh_token !== user.refreshToken) {
    //   throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    // }

    const { password, ...userData } = user;
    return userData;
  }
}
