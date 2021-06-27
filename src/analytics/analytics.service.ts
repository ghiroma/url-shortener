import { Injectable, NotFoundException } from '@nestjs/common';
import { DynamoDB } from 'aws-sdk';
import { DateTime } from 'luxon';
import { AnalyticsResponseDTO } from '../dto/analyticsResponse.dto';
import { AnalyticsRequestDto } from '../dto/analyticsRequest.dto';
import { ConfigService } from '@nestjs/config';
import { AppService } from 'src/app.service';

import DB from '../constants/db.constants';
import ERRORS from '../constants/errors.constants';

@Injectable()
export class AnalyticsService {
  private dynamoDb: DynamoDB;
  constructor(private readonly configService: ConfigService,
    private readonly appService: AppService) {
    this.dynamoDb = new DynamoDB({
      region: this.configService.get<string>('region'),
      apiVersion: this.configService.get<string>('apiVersion')
    });
  }

  async getAnalytics(
    request: AnalyticsRequestDto,
  ): Promise<AnalyticsResponseDTO> {
    const exists = await this.appService.getByHash(request.hash);

    if (!exists) {
      throw new NotFoundException(ERRORS.HASH_NOT_FOUND);
    }

    const lastDay = DateTime.now().minus({ days: 1 }).toISO();

    const statement = `SELECT ${DB.TABLES.ANALYTICS.FIELDS.HASH} 
            FROM ${DB.TABLES.ANALYTICS.NAME}
            WHERE "${DB.TABLES.ANALYTICS.FIELDS.HASH}" = '${request.hash}' 
            AND "${DB.TABLES.ANALYTICS.FIELDS.TIMESTAMP}" >= '${lastDay}'`;

    const response = await this.dynamoDb
      .executeStatement({ Statement: statement })
      .promise();

    return new AnalyticsResponseDTO(request.hash, response.Items.length);
  }

  async addEntry(shortUrl: string): Promise<void> {
    const statement = `INSERT INTO ${DB.TABLES.ANALYTICS.NAME}
        VALUE { '${DB.TABLES.ANALYTICS.FIELDS.HASH}' : '${shortUrl}', 
        '${DB.TABLES.ANALYTICS.FIELDS.TIMESTAMP
      }': '${DateTime.utc().toISO()}' }`;

    await this.dynamoDb.executeStatement({ Statement: statement }).promise();
  }
}
