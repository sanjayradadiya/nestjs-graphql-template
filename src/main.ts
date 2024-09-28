import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import moment from 'moment-timezone';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { graphqlUploadExpress } from 'graphql-upload';


moment.tz.setDefault('Asia/Calcutta');
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 4 * 1024 * 1024, maxFiles: 10 }),
  );
  app.useStaticAssets(join(process.cwd(), './src/uploads'));
  app.enableCors();
  await app.listen(3005);
}

bootstrap();
