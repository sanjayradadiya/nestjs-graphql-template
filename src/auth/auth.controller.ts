import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/set-password.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { TokenManagerHelperClass } from '../user/helpers/tokenManager.helper';
import { RefreshUserTokenInput } from '../user/types/token.interface';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private TokenManagerHelper: TokenManagerHelperClass,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(@Body() body: RefreshUserTokenInput) {
    return this.authService.refreshUserToken(body);
  }

  /**
   * This api is used to test email
   *
   * @param body
   * @param req
   */
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post('/test-email')
  async sendTestEmail(@Body() body: any, @Req() req) {
    if (!body.email) {
      throw new BadRequestException('Please provide the email address');
    }

    await this.authService.sendTestEmail(body.email);

    return {
      success: true,
    };
  }

  /**
   * This api is used to generate the email to reset the password i.e. forgot password functionality
   * It will generate the email and send it to user via email. User can use that email to set new password.
   *
   * @param body
   */
  @HttpCode(HttpStatus.OK)
  @Post('/forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }

  /**
   * This api is used to generated in forgot password, and set new password.
   *
   * @param body
   */
  @HttpCode(HttpStatus.OK)
  @Post('/set-password')
  async setPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }
}
