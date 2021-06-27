import { Controller, Get, Param, Logger } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsRequestDto } from '../dto/analyticsRequest.dto';
import { AnalyticsResponseDTO } from '../dto/analyticsResponse.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @Get(':shortUrl')
  async getAnalytics(
    @Param() request: AnalyticsRequestDto,
  ): Promise<AnalyticsResponseDTO> {
    return await this.analyticsService.getAnalytics(request);
  }
}
