import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { MailModule } from './mail/mail.module';
import { AppConfigs } from './appConfigs';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { PermissionModule } from './permission/permission.module';
import { Modules } from './module/module.module';
import { PermissionsGuard } from './common/guards/permission.gaurd';
import { NotificationModule } from './notification/notification.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ErrorHandlingMiddleware } from './ErrorHandlingMiddleware';
import { StatusCodes } from 'http-status-codes';
import { ConfigurationModule } from './configuration/configuration.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true,
      sortSchema: true,
      introspection: true,
      formatError: (error) => {
        const graphQLFormattedError = {
          message: error.message,
          code: error.extensions?.code || 'SERVER_ERROR',
          name: error.name,
          httpStatus:
            (error?.extensions?.response as any)?.statusCode ||
            (error?.extensions?.exception as any)?.httpStatus ||
            StatusCodes.INTERNAL_SERVER_ERROR,
        };
        return graphQLFormattedError;
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
      ],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + './migrations/*.js'],
        logging: false,
      }),
      inject: [ConfigService],
    }),
    ConfigurationModule,
    UserModule,
    AuthModule,
    RoleModule,
    MailModule,
    ScheduleModule.forRoot(),
    PermissionModule,
    Modules,
    NotificationModule,
  ],
  controllers: [],
  providers: [AppConfigs, PermissionsGuard],
  exports: [AuthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorHandlingMiddleware).forRoutes('*'); // Apply middleware to GraphQL routes
  }
}
