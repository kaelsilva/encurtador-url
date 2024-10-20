import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerService } from './url-shortener.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UrlShortener } from './entities/url-shortener.entity';
import { mockUrlShortenerRepository } from '../mocks/url-shortener.repository';
import { User } from '../user/entities/user.entity';

describe('UrlShortenerService', () => {
  let service: UrlShortenerService;
  let urlRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlShortenerService,
        {
          provide: getRepositoryToken(UrlShortener),
          useValue: mockUrlShortenerRepository,
        },
      ],
    }).compile();

    service = module.get<UrlShortenerService>(UrlShortenerService);
    urlRepository = module.get(getRepositoryToken(UrlShortener));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new URL', async () => {
      const createUrlShortenerDto = { url: 'https://example.com' };
      const user: User = { id: 1 } as User;
      const savedUrl = {
        id: 1,
        originalUrl: createUrlShortenerDto.url,
        shortUrl: 'abc123',
        user,
      };

      jest.spyOn(urlRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(urlRepository, 'save').mockResolvedValue(savedUrl);

      const result = await service.create(createUrlShortenerDto, user);
      expect(result).toHaveLength(6);
    });

    it('should return existing URL if it already exists', async () => {
      const createUrlShortenerDto = { url: 'https://example.com' };
      const existingUrl = {
        id: 1,
        originalUrl: createUrlShortenerDto.url,
        shortUrl: 'abc123',
      };

      jest.spyOn(urlRepository, 'findOne').mockResolvedValue(existingUrl);

      const result = await service.create(createUrlShortenerDto);
      expect(result).toEqual(existingUrl);
    });
  });

  describe('findOriginalUrl', () => {
    it('should return the original URL', async () => {
      const shortUrl = 'abc123';
      const urlRecord = {
        originalUrl: 'https://example.com',
        shortUrl,
        redirectCount: 0,
      };

      jest.spyOn(urlRepository, 'findOne').mockResolvedValue(urlRecord);

      const result = await service.findOriginalUrl(shortUrl);
      expect(result).toEqual(urlRecord.originalUrl);
      expect(urlRecord.redirectCount).toBe(1);
      expect(urlRepository.save).toHaveBeenCalledWith(urlRecord);
    });

    it('should throw NotFoundException if URL not found', async () => {
      const shortUrl = 'nonexistent';
      jest.spyOn(urlRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOriginalUrl(shortUrl)).rejects.toThrowError();
    });
  });
});
