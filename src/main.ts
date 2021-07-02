import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { KeyService } from './keys/key.service';
import { Key } from './keys/key';

const logger: Logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(new KeyService().getKey(Key.PORT));
  logger.log(`Application is running on: ${await app.getUrl()} at Server ${new KeyService().getKey(Key.APPID)}`);
}
bootstrap();
