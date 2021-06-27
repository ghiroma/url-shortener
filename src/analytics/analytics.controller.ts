import { Controller, Get, Param, Logger } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsRequestDto } from '../dto/analyticsRequest.dto';
import { AnalyticsResponseDTO } from '../dto/analyticsResponse.dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) { }

  @ApiOperation({
    summary: 'Returns analytics information based on a hash'
  })
  @ApiParam({
    name: 'hash',
    required: true,
    example: 'google'
  })
  @Get(':hash')
  async getAnalytics(
    @Param() request: AnalyticsRequestDto,
  ): Promise<AnalyticsResponseDTO> {
    return await this.analyticsService.getAnalytics(request);
  }
}
