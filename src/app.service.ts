import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DynamoDB } from 'aws-sdk';
import { nanoid } from 'nanoid';
import { ShortUrlDto } from './dto/shortUrl.dto';
import { ConfigService } from '@nestjs/config';
import getRandomLength from './helper/getRandomLength';

import EVENTS from './constants/events.constants';
import DB from './constants/db.constants';
import ERRORS from './constants/errors.constants';

@Injectable()
export class AppService {
  private dynamoDb: DynamoDB;

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {
    this.dynamoDb = new DynamoDB({
      region: this.configService.get<string>('region'),
      apiVersion: this.configService.get<string>('apiVersion')
    });
  }

  async assignUrl(shortUrlRequest: ShortUrlDto): Promise<ShortUrlDto> {
    const existsOriginalUrl = await this.getByOriginalUrl(shortUrlRequest.originalUrl);

    if (shortUrlRequest.hash) {
      if (existsOriginalUrl && existsOriginalUrl.hash != shortUrlRequest.hash) {
        throw new NotFoundException(ERRORS.URL_ALREADY_SHORTENED);
      } else if (existsOriginalUrl && existsOriginalUrl.hash == shortUrlRequest.hash) {
        return existsOriginalUrl;
      }

      const exists = await this.getByHash(shortUrlRequest.hash);

      if (exists) {
        throw new UnprocessableEntityException(ERRORS.HASH_ALREADY_IN_USE);
      }
    } else if (existsOriginalUrl) {
      return existsOriginalUrl;
    } else {
      shortUrlRequest.originalUrl = shortUrlRequest.originalUrl.replace(/\/$/, "");
      shortUrlRequest.hash = await this.generateUrl();
    }

    const statement = `INSERT INTO ${DB.TABLES.URLS.NAME} VALUE
     {'${DB.TABLES.URLS.FIELDS.HASH}' : '${shortUrlRequest.hash}', 
     '${DB.TABLES.URLS.FIELDS.ORIGINAL_URL}' : '${shortUrlRequest.originalUrl}' }`;

    await this.dynamoDb.executeStatement({ Statement: statement }).promise();

    return new ShortUrlDto(
      shortUrlRequest.originalUrl,
      shortUrlRequest.hash,
    );
  }

  async getRedirectUrl(hash: string): Promise<string> {
    const item = await this.getByHash(hash);

    if (!item) {
      throw new NotFoundException(ERRORS.HASH_NOT_FOUND);
    }

    this.eventEmitter.emit(EVENTS.URL_CLICKED, hash);
    return item.originalUrl;
  }

  async getByHash(hash: string): Promise<ShortUrlDto | null> {
    const statement = `SELECT ${DB.TABLES.URLS.FIELDS.HASH}, ${DB.TABLES.URLS.FIELDS.ORIGINAL_URL}
     FROM ${DB.TABLES.URLS.NAME} WHERE "${DB.TABLES.URLS.FIELDS.HASH}" = '${hash}'`;
    const response = await this.dynamoDb
      .executeStatement({ Statement: statement })
      .promise();

    if (response.Items.length == 0) {
      return null;
    }

    const item = response.Items[0];
    return new ShortUrlDto(item.original_url.S, item.hash.S);
  }

  private async getByOriginalUrl(
    originalUrl: string,
  ): Promise<ShortUrlDto | null> {
    const statement = `SELECT ${DB.TABLES.URLS.FIELDS.ORIGINAL_URL}, ${DB.TABLES.URLS.FIELDS.HASH} 
    FROM ${DB.TABLES.URLS.NAME} WHERE "${DB.TABLES.URLS.FIELDS.ORIGINAL_URL}" = '${originalUrl}'`;

    const response = await this.dynamoDb
      .executeStatement({ Statement: statement })
      .promise();

    if (response.Items.length == 0) {
      return null;
    }

    const item = response.Items[0];
    return new ShortUrlDto(item.original_url.S, item.hash.S);
  }

  private async generateUrl(): Promise<string> {
    let hash: string;
    let exists = null;
    let retry = 10;

    do {
      hash = nanoid(getRandomLength());
      exists = await this.getByHash(hash);
      retry--;
    } while (exists && retry > 0);

    if (exists) {
      throw new InternalServerErrorException(ERRORS.CANNOT_GENERATE_URL);
    }

    return hash;
  }
}
