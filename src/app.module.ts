import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AnalyticsController } from './analytics/analytics.controller';
import { AnalyticsService } from './analytics/analytics.service';
import { AnalyticsListener } from './analytics/analytics.listener';

import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ load: [configuration] }),
  ],
  controllers: [AppController, AnalyticsController],
  providers: [AppService, AnalyticsService, AnalyticsListener],
})
export class AppModule {}
