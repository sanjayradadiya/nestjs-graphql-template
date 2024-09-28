import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenUsageEnum } from '../user/types/token.interface';
import { JWTConstants } from '../common/constants';
import { DEFAULT_MAIL_SERVICE_NAME, TEST_MAIL_SERVICE_NAME } from './utils';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private mailerService: MailerService,
    private configureService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async addMailTransporter(host: string, user: string, pass: string) {
    this.mailerService.addTransporter(DEFAULT_MAIL_SERVICE_NAME, {
      host,
      auth: { user, pass },
    });
  }

  private async _sendEmail(
    toEmail: string,
    subject: string,
    template: string,
    data: any = {},
    fromEmail?: string,
    ccEmail?: string[],
  ) {
    try {
      let toEmailAddress = toEmail;
      this.logger.log(`Sending "${subject}" email to ${toEmailAddress}`);

      if (this.configureService.get<string>('MAIL_SEND_NOTHING') === 'true') {
        this.logger.log(
          'Skipping sending email as MAIL_SEND_NOTHING is set to true.',
        );
        return;
      }

      const sendAllTo = this.configureService.get<string>('MAIL_SEND_ALL_TO');

      if (sendAllTo) {
        this.logger.log(
          `Sending email to ${sendAllTo} instead of ${toEmailAddress} as MAIL_SEND_ALL_TO is set`,
        );
        toEmailAddress = `"Sent on behalf of ${toEmailAddress}" <${sendAllTo}>`;
      }

      const emailOptions: ISendMailOptions = {
        to: toEmailAddress,
        subject,
        template: `./${template}`, // `.hbs` extension is appended automatically
        context: data,
        cc: ccEmail,
        transporterName: DEFAULT_MAIL_SERVICE_NAME,
      };

      // If fromEmail is provided then use that email instead of default email
      if (fromEmail) {
        emailOptions.from = fromEmail; // '"Support Team" <support@example.com>', // override default from
      }

      // Sending actual email
      const result = await this.mailerService.sendMail(emailOptions);
      return result;
    } catch (error) {
      this.logger.log('Please correct the mail configuration:', error.message);
      throw error;
    }
  }

  /**
   * This method is used to send test email
   *
   * @param emailAddress
   */
  async sendTestMail(emailAddress: string) {
    const result = await this._sendEmail(
      emailAddress,
      'Test Email',
      'test-email',
    );
    return result;
  }

  async sendInvitationLink(user: any) {
    console.log(this.configureService.get('JWT_VERIFICATION_TOKEN_SECRET'));
    const token = this.jwtService.sign(
      { email: user.email, tokenUse: TokenUsageEnum.INVITE },
      {
        secret: JWTConstants.secret,
        expiresIn: '24h',
      },
    );
    console.log(token);
    const url = `${this.configureService.get(
      'EMAIL_VERIFY_URL',
    )}?token=${token}`;

    const emailData = {
      name: `${user.first_name || ''} ${user.last_name || ''}`,
      url,
    };
    const result = await this._sendEmail(
      user.email,
      'Welcome to Admin template App! Confirm your Email',
      'invitation-link',
      emailData,
    );
    return result;
  }

  /**
   * This method is used to send forgot password email
   *
   * @param user
   */
  async sendForgotPasswordEmail(user: any) {
    const token = this.jwtService.sign(
      { email: user.email, tokenUse: TokenUsageEnum.FORGOT_PASSWORD },
      {
        secret: JWTConstants.secret,
        expiresIn: '24h',
      },
    );
    const base_url = this.configureService.get<string>('FRONT_END_BASE_URL');
    const emailData = {
      name: `${user.first_name || ''} ${user.last_name || ''}`,
      url: `${base_url}/reset-password?token=${token}`,
    };
    await this._sendEmail(
      user.email,
      'Reset password Email',
      'forgot-password',
      emailData,
    );
  }

  async testConfiguration(
    host: string,
    user: string,
    pass: string,
    testEmailAddress: string,
  ): Promise<string> {
    this.mailerService.addTransporter(TEST_MAIL_SERVICE_NAME, {
      host,
      auth: { user, pass },
    });

    const mailOptions: ISendMailOptions = {
      to: testEmailAddress,
      from: 'no-reply@example.com',
      subject: 'Test Email',
      template: './test-email',
    };

    try {
      this.logger.log('Test mail sending........');
      await this.mailerService.sendMail({
        transporterName: 'testTransport',
        ...mailOptions,
      });
      this.logger.log('Test mail sended');

      return 'Email sent successfully';
    } catch (error) {
      return `Failed to send email: ${error.message}`;
    }
  }
}
