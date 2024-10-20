import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { mockUserService } from '../mocks/user.service';
import { mockJwtService } from '../mocks/jwt.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const now = new Date();
      const user = {
        id: 1,
        email,
        password: await bcrypt.hash(password, 10),
        urls: [],
        createdAt: now,
        updatedAt: now,
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);

      const result = await service.validateUser(email, password);
      expect(result).toEqual({
        id: 1,
        email: 'test@example.com',
        createdAt: now,
        updatedAt: now,
        urls: [],
      });
    });

    it('should return null if user not found', async () => {
      const email = 'test@example.com';
      const password = 'password';

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

      const result = await service.validateUser(email, password);
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = {
        id: 1,
        email,
        password: await bcrypt.hash('wrongpassword', 10),
        urls: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);

      const result = await service.validateUser(email, password);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token if credentials are valid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const user = {
        id: 1,
        email: loginDto.email,
        password: await bcrypt.hash(loginDto.password, 10),
        urls: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(userService, 'findByEmail').mockResolvedValue(user);
      jest.spyOn(service, 'validateUser').mockResolvedValue(user);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mocked_token');

      const result = await service.login(loginDto);
      expect(result).toEqual({ access_token: 'mocked_token' });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
