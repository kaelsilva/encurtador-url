import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Req,
  Delete,
  Patch,
} from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import { User } from '../user/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthenticatedRequest } from '../auth/auth-request.interface';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { UpdateUrlShortenerDto } from './dto/update-url-shortener.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('URL Shortener')
@UseGuards(OptionalAuthGuard)
@Controller('url-shortener')
export class UrlShortenerController {
  constructor(private readonly urlShortenerService: UrlShortenerService) {}

  @Post()
  async shortenUrl(
    @Body() createUrlShortenerDto: CreateUrlShortenerDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = req.user as User;
    const result = await this.urlShortenerService.create(
      createUrlShortenerDto,
      user,
    );
    return { shortUrl: `${process.env.BASE_URL}/${result}` };
  }

  @Get()
  async findAllForUser(@Req() req: AuthenticatedRequest) {
    const user = req.user as User;
    const result = await this.urlShortenerService.findAllForUser(user);
    return result;
  }

  @Patch(':shortUrl')
  async updateUrl(
    @Param('shortUrl') shortUrl: string,
    @Req() req: AuthenticatedRequest,
    @Body() updateUrlShortenerDto: UpdateUrlShortenerDto,
  ) {
    const user = req.user as User;
    return await this.urlShortenerService.updateUrl(
      shortUrl,
      updateUrlShortenerDto,
      user,
    );
  }

  @Delete(':shortUrl')
  async softDelete(
    @Param('shortUrl') shortUrl: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const user = req.user as User;
    await this.urlShortenerService.logicalDelete(shortUrl, user);
    return { message: 'URL has logically soft-deleted' };
  }
}
