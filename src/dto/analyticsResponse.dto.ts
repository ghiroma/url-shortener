import { IsNotEmpty, IsNumber, IsPositive, MaxLength } from 'class-validator';

export class AnalyticsResponseDTO {
  constructor(hash: string, clicks: number) {
    this.hash = hash;
    this.clicks = clicks;
  }

  @IsNotEmpty()
  @MaxLength(6)
  hash: string;

  @IsPositive()
  @IsNumber()
  clicks: number;
}
