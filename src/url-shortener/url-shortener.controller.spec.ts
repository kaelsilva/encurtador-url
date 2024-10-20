import { Test, TestingModule } from '@nestjs/testing';
import { UrlShortenerController } from './url-shortener.controller';
import { UrlShortenerService } from './url-shortener.service';
import { mockUrlShortenerRepository } from '../mocks/url-shortener.repository';

describe('UrlShortenerController', () => {
  let controller: UrlShortenerController;
  let service: UrlShortenerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlShortenerController],
      providers: [
        UrlShortenerService,
        {
          provide: 'UrlShortenerRepository',
          useValue: mockUrlShortenerRepository,
        },
      ],
    }).compile();

    controller = module.get<UrlShortenerController>(UrlShortenerController);
    service = module.get<UrlShortenerService>(UrlShortenerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
