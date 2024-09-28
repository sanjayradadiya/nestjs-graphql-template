import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConfigurationInput } from './dto/create-configuration.input';
import { UpdateConfigurationInput } from './dto/update-configuration.input';
import { FileUpload } from 'graphql-upload';
import { Configuration } from './entities/configuration.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { GLOBAL_CONFIGURATION_KEY } from './utils';
import { CryptoService } from 'src/common/providers/crypto.service';
import { TestMailConfigurationInput } from './dto/test-configuration.input';
import { put, del } from '@vercel/blob';
@Injectable()
export class ConfigurationService {
  configuration: Configuration;
  private defaultValue = {
    businessName: 'Admin template',
    footer: `© ${new Date().getFullYear()}, made by Admin template.`,
    logo: 'https://itxhl1mjpywl6fqu.public.blob.vercel-storage.com/logo-V59YnE4tL5WEyxbF8tPCT5GDTEQ7PT.png',
    superAdminEmail: 'demo@demo.com',
    mailHost: 'smtp.gmail.com',
    mailUser: 'demo@demo.com',
    mailPassword: '1ea82cf75a09c5a96360d8f20d0ccd6f',
  };

  constructor(
    @InjectRepository(Configuration)
    private configurationRepository: Repository<Configuration>,
    private mailService: MailService,
    private cryptoService: CryptoService,
  ) {
    this.loadConfiguration();
  }

  async loadConfiguration() {
    try {
      const res = await this.findAll();
      if (res?.[0]) {
        const { mailHost, mailPassword, mailUser, superAdminEmail } = res[0];
        if (mailHost && mailPassword && mailUser && superAdminEmail) {
          this.mailService.addMailTransporter(
            mailHost,
            mailUser,
            this.cryptoService.decryptPassword(mailPassword),
          );
          // await this.mailService.sendTestMail(superAdminEmail);
        }
        this.configuration = res[0];
        global[GLOBAL_CONFIGURATION_KEY] = res[0];
      } else {
        this.createDefaultValue().then((res) => {
          global[GLOBAL_CONFIGURATION_KEY] = res;
        });
      }
    } catch (error) {
      console.log('configuration:', error);
      // process.exit(1);
    }
  }

  async storeUpload(file: Promise<FileUpload>): Promise<string> {
    try {
      const { createReadStream, filename } = await file;
      const stream = createReadStream();
      const chunks = [];
      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      const res = await put(filename, buffer, { access: 'public' });
      return res.url;
    } catch (err) {
      console.error('uploading error ====>', err.message);
      throw new NotFoundException(err.message);
    }
  }

  private async createDefaultValue() {
    return this.configurationRepository.save(this.defaultValue);
  }

  async create(createConfigurationInput: CreateConfigurationInput) {
    try {
      const dto = new Configuration();

      // Assign input properties to the entity
      Object.assign(dto, createConfigurationInput);

      // Handle file upload separately
      if (createConfigurationInput.logo) {
        dto.logo = await this.storeUpload(createConfigurationInput.logo);
      }

      if (createConfigurationInput.mailPassword) {
        dto.mailPassword = this.cryptoService.encryptPassword(
          createConfigurationInput.mailPassword,
        );
      }
      const res = await this.configurationRepository.save(dto);

      return {
        success: true,
        data: res,
        reason: 'Configuration added successfully.',
      };
    } catch (error) {
      return {
        success: false,
        reason: error.message,
      };
    }
  }

  async findAll() {
    const data = await this.configurationRepository.find();
    return data;
  }

  findOne(id: string) {
    return this.configurationRepository.findOne({ where: { id } });
  }

  async update(id: string, updateConfigurationInput: UpdateConfigurationInput) {
    try {
      const configuration = await this.findOne(id);
      if (!configuration) {
        throw new Error('Configuration not found.');
      }

      if (!updateConfigurationInput.mailPassword) {
        if (!configuration.mailPassword) {
          throw new Error('Mail password is not defined.');
        }
        updateConfigurationInput.mailPassword = configuration.mailPassword;
      } else {
        updateConfigurationInput.mailPassword =
          this.cryptoService.encryptPassword(
            updateConfigurationInput.mailPassword,
          );
      }

      if (updateConfigurationInput.logo) {
        if (configuration.logo) {
          await del(configuration.logo);
        }
        const logoUrl = await this.storeUpload(updateConfigurationInput.logo);
        configuration.logo = logoUrl;
        delete updateConfigurationInput.logo;
      }

      Object.assign(configuration, updateConfigurationInput);
      await this.configurationRepository.save(configuration);
      const { mailHost, mailPassword, mailUser } = updateConfigurationInput;
      if (mailHost && mailPassword && mailUser) {
        this.mailService.addMailTransporter(
          configuration.mailHost,
          configuration.mailUser,
          configuration.mailPassword,
        );
      }
      return {
        success: true,
        reason: 'Configuration updated successfully.',
      };
    } catch (error) {
      return {
        success: false,
        reason: error.message,
      };
    }
  }

  remove(id: string) {
    try {
      return this.configurationRepository.delete(id).then(() => {
        return {
          reason: 'Configuration deleted successfully.',
          success: false,
        };
      });
    } catch (error) {
      return {
        reason: error.message || 'Something went to wrong.',
        success: false,
      };
    }
  }

  async testEmail(config: TestMailConfigurationInput) {
    try {
      const { host, user, pass, testEmailAddress } = config;
      await this.mailService.testConfiguration(
        host,
        user,
        pass,
        testEmailAddress,
      );

      return {
        success: true,
        reason: 'Email sent. Please check your inbox.',
      };
    } catch (error) {
      return {
        success: false,
        reason: 'Email could not be sent. Please try again.',
      };
    }
  }
}
