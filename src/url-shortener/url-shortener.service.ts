import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { UrlShortener } from './entities/url-shortener.entity';
import { CreateUrlShortenerDto } from './dto/create-url-shortener.dto';
import { User } from '../user/entities/user.entity';
import * as crypto from 'crypto';
import { UpdateUrlShortenerDto } from './dto/update-url-shortener.dto';

@Injectable()
export class UrlShortenerService {
  constructor(
    @InjectRepository(UrlShortener)
    private readonly urlRepository: Repository<UrlShortener>,
  ) {}

  private generateShortUrl(): string {
    return crypto.randomBytes(4).toString('base64url');
  }

  async create(createUrlShortenerDto: CreateUrlShortenerDto, user?: User) {
    const { url } = createUrlShortenerDto;

    const existing = await this.urlRepository.findOne({
      where: { originalUrl: url, user: { id: user?.id } },
    });
    if (existing) {
      return existing.shortUrl;
    }

    const shortUrl = this.generateShortUrl();
    const newUrl = this.urlRepository.create({
      originalUrl: url,
      shortUrl,
      user: user ? user : null,
    });

    await this.urlRepository.save(newUrl);

    return shortUrl;
  }

  async findOriginalUrl(shortUrl: string): Promise<string> {
    const urlRecord = await this.urlRepository.findOne({
      where: { shortUrl, deletedAt: null },
    });

    if (!urlRecord) {
      throw new NotFoundException('Shortened URL not found.');
    }

    urlRecord.redirectCount += 1;
    await this.urlRepository.save(urlRecord);

    return urlRecord.originalUrl;
  }

  async findAllForUser(user?: User): Promise<UrlShortener[]> {
    if (!user)
      throw new HttpException('Unauthorized.', HttpStatus.UNAUTHORIZED);

    const urlRecords = await this.urlRepository.find({
      where: { user: { id: user.id }, deletedAt: IsNull() },
    });

    if (!urlRecords) {
      throw new NotFoundException('URL records not found.');
    }
    return urlRecords;
  }

  async logicalDelete(shortUrl: string, user?: User) {
    if (!user)
      throw new HttpException('Unauthorized.', HttpStatus.UNAUTHORIZED);

    const urlShortened = await this.urlRepository.findOne({
      where: { shortUrl, user: { id: user.id }, deletedAt: null },
    });

    if (!urlShortened) {
      throw new NotFoundException('URL not found or already deleted.');
    }

    urlShortened.deletedAt = new Date();
    return this.urlRepository.save(urlShortened);
  }

  async updateUrl(
    shortUrl: string,
    updateUrlShortenerDto: UpdateUrlShortenerDto,
    user?: User,
  ) {
    if (!user)
      throw new HttpException('Unauthorized.', HttpStatus.UNAUTHORIZED);

    const urlShortened = await this.urlRepository.findOne({
      where: { shortUrl, user: { id: user.id }, deletedAt: null },
    });

    if (!urlShortened) {
      throw new NotFoundException('URL not found or already deleted.');
    }

    urlShortened.originalUrl = updateUrlShortenerDto.url;
    return this.urlRepository.save(urlShortened);
  }
}
