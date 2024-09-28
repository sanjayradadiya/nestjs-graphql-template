import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JWTConstants } from 'src/common/constants';
import { JwtStrategy } from './jwt.strategy';
import { MailModule } from 'src/mail/mail.module';
import { CryptoService } from 'src/common/providers/crypto.service';
import { UserValidatorsHelperClass } from 'src/user/helpers/user.validator';
import { TokenManagerHelperClass } from 'src/user/helpers/tokenManager.helper';
import { PasswordManagerHelperClass } from 'src/user/helpers/passwordManager.helper';
import { AppConfigs } from 'src/appConfigs';
import { GqlJwtAuthGuard } from './gql-jwt-auth.guard';
import { AuthResolver } from './auth.resolver';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: JWTConstants.secret,
      signOptions: { expiresIn: '3h' },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    CryptoService,
    GqlJwtAuthGuard,
    UserValidatorsHelperClass,
    TokenManagerHelperClass,
    PasswordManagerHelperClass,
    AppConfigs,
    AuthResolver,
  ],
  exports: [AuthService],
})
export class AuthModule {}
