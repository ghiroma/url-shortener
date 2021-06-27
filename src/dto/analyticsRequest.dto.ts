import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class AnalyticsRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(6)
  shortUrl: string;
}
