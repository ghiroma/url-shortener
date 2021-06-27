import { IsNotEmpty, MaxLength } from 'class-validator';

export class AnalyticsRequestDto {
  @IsNotEmpty()
  @MaxLength(6)
  shortUrl: string;
}
