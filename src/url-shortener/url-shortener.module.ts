import { Module } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { UrlShortenerController } from './url-shortener.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlShortener } from './entities/url-shortener.entity';
import { RedirectController } from './redirect.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UrlShortener]), UserModule],
  controllers: [UrlShortenerController, RedirectController],
  providers: [UrlShortenerService],
})
export class UrlShortenerModule {}
