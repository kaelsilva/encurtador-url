import { Controller, Get, Param, Res } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('/')
export class RedirectController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @ApiTags('Redirect to URL')
  @Get(':shortUrl')
  async redirectToOriginal(@Param('shortUrl') shortUrl: string, @Res() res) {
    const originalUrl =
      await this.urlShortenerService.findOriginalUrl(shortUrl);
    return res.redirect(originalUrl);
  }
}
