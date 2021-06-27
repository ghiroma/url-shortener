import { Logger, HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ShortUrlDto } from './dto/shortUrl.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Redirect()
  @Get(':shortUrl')
  async redirect(@Param('shortUrl') shortUrl: string) {
    const url = await this.appService.getRedirectUrl(shortUrl);
    return { statusCode: HttpStatus.FOUND, url: url };
  }

  @Post()
  async shortenUrl(@Body() shortUrlRequest: ShortUrlDto): Promise<ShortUrlDto> {
    return await this.appService.assignUrl(shortUrlRequest);
  }
}
