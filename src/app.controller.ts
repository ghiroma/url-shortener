import { HttpStatus } from '@nestjs/common';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Redirect,
} from '@nestjs/common';
import { ApiBody, ApiExcludeEndpoint, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ShortUrlDto } from './dto/shortUrl.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiExcludeEndpoint()
  @Get()
  test() {
    return { statusCode: 200 }
  }

  @ApiOperation({
		summary: 'Converts short url to full url'
	})
  @ApiParam({
    name: 'shortUrl',
    required: true,
    example: 'pepepe'
  })
  @Redirect()
  @Get(':shortUrl')
  async redirect(@Param('shortUrl') shortUrl: string) {
    const url = await this.appService.getRedirectUrl(shortUrl);
    return { statusCode: HttpStatus.FOUND, url: url };
  }

  @ApiOperation({
		summary: 'Generates a short url based on a full url'
	})
  @Post()
  async shortenUrl(@Body() shortUrlRequest: ShortUrlDto): Promise<ShortUrlDto> {
    return await this.appService.assignUrl(shortUrlRequest);
  }
}
