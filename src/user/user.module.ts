import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MailModule } from 'src/mail/mail.module';
import { UserValidatorsHelperClass } from './helpers/user.validator';
import { TokenManagerHelperClass } from './helpers/tokenManager.helper';
import { PasswordManagerHelperClass } from './helpers/passwordManager.helper';
import { AppConfigs } from 'src/appConfigs';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserResolver } from './user.resolver';
import { Role } from '../role/entities/role.entity';
import { RoleModule } from 'src/role/role.module';
import { NotificationModule } from '../notification/notification.module';
import { JWTConstants } from 'src/common/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    MailModule,
    RoleModule,
    forwardRef(() => NotificationModule),
    JwtModule.registerAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
      ],
      useFactory: (configService: ConfigService) => ({
        secret: JWTConstants.secret,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    UserService,
    UserResolver,
    UserValidatorsHelperClass,
    TokenManagerHelperClass,
    PasswordManagerHelperClass,
    AppConfigs,
  ],
  exports: [UserService],
})
export class UserModule {}
