import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { InternalServerErrorFilter } from './filter/internalServerError.filter';
import { Settings } from 'luxon';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new InternalServerErrorFilter());
  app.useGlobalPipes(new ValidationPipe());
  Settings.defaultZoneName = 'utc';

  await app.listen(3000);
}
bootstrap();
