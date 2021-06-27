import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import EVENTS from '../constants/events.constants';
import { AnalyticsService } from './analytics.service';

@Injectable()
export class AnalyticsListener {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @OnEvent(EVENTS.URL_CLICKED, { async: true })
  async handleUrlClicked(payload: string): Promise<void> {
    await this.analyticsService.addEntry(payload);
  }
}
