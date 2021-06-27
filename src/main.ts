import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { InternalServerErrorFilter } from './filter/internalServerError.filter';
import { Settings } from 'luxon';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Url shortening service')
    .setDescription('Service to shortern urls with basic analytics')
    .setVersion('1.0')
    .addTag('Coding test')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.useGlobalFilters(new InternalServerErrorFilter());
  app.useGlobalPipes(new ValidationPipe());
  Settings.defaultZoneName = 'utc';

  await app.listen(configService.get<number>('port'));
}

bootstrap();
