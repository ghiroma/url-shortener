import { IsNotEmpty, IsNumber, IsPositive, MaxLength } from 'class-validator';

export class AnalyticsResponseDTO {
  constructor(shortUrl: string, clicks: number) {
    this.shortUrl = shortUrl;
    this.clicks = clicks;
  }

  @IsNotEmpty()
  @MaxLength(6)
  shortUrl: string;

  @IsPositive()
  @IsNumber()
  clicks: number;
}
