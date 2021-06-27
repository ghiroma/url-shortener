import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUrl, MaxLength } from 'class-validator';

export class ShortUrlDto {
  constructor(originalUrl: string, shortUrl: string) {
    this.originalUrl = originalUrl;
    this.shortUrl = shortUrl;
  }

  @ApiProperty()
  @IsOptional()
  @MaxLength(6)
  shortUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl({
    require_host: true,
    require_protocol: true,
    allow_protocol_relative_urls: false,
  })
  originalUrl: string;
}
