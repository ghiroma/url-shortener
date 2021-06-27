import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { InternalServerErrorFilter } from './filter/internalServerError.filter';
import { Settings } from 'luxon';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalFilters(new InternalServerErrorFilter());
  app.useGlobalPipes(new ValidationPipe());
  Settings.defaultZoneName = 'utc';

  await app.listen(configService.get<number>('port'));
}

bootstrap();
