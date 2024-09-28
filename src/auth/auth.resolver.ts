import {
  BadRequestException,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { LoginDto, RefreshResponse, SendTestEmailResponse, LoginSuccessReturn } from "./dto/login.dto";
import { RefreshUserTokenInput } from "src/user/types/token.interface";
import { LocalAuthGuard } from "./local-auth.guard";

@Resolver(() => LoginDto)
// @UseGuards(LocalAuthGuard)
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginSuccessReturn, { name: 'login' })
  login(@Args('input') loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  @Mutation(() => RefreshResponse)
  refresh(@Body() body: RefreshUserTokenInput) {
    return this.authService.refreshUserToken(body);
  }

  @Mutation(() => SendTestEmailResponse)
  async sendTestEmail(@Body() body: any, @Req() req) {
    if (!body.email) {
      throw new BadRequestException("Please provide the email address");
    }

    await this.authService.sendTestEmail(body.email);

    return {
      success: true,
    };
  }

  // @Mutation(() => ForgotPasswordDto)
  // forgotPassword(@Body() body: ForgotPasswordDto) {
  //   return this.authService.forgotPassword(body);
  // }

  // @Mutation(() => ForgotPasswordDto)
  // forgotPassword(@Body() body: ForgotPasswordDto) {
  //   return this.authService.forgotPassword(body);
  // }

  // @Mutation(() => ResetPasswordDto)
  // resetPassword(@Body() body: ResetPasswordDto) {
  //   return this.authService.resetPassword(body);
  // }
}
