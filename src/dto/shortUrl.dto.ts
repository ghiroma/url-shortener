import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUrl, MaxLength } from 'class-validator';

export class ShortUrlDto {
  constructor(originalUrl: string, hash: string) {
    this.originalUrl = originalUrl;
    this.hash = hash;
  }

  @ApiProperty()
  @IsOptional()
  @MaxLength(6)
  hash: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl({
    require_host: true,
    require_protocol: true,
    allow_protocol_relative_urls: false,
  })
  originalUrl: string;
}
