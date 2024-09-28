import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';
import { ConfigurationResolver } from './configuration.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from './entities/configuration.entity';
import { MailModule } from 'src/mail/mail.module';
import { CryptoService } from 'src/common/providers/crypto.service';

@Module({
  imports: [TypeOrmModule.forFeature([Configuration]), MailModule],
  providers: [ConfigurationResolver, ConfigurationService, CryptoService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
