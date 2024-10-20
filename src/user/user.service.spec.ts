import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { mockUserRepository } from '../mocks/user.repository';

describe('UserService', () => {
  let service: UserService;
  let userRepository;
  const now = new Date();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = { email: 'test@example.com', password: 'password' };
      const user = {
        id: 1,
        email: createUserDto.email,
        password: 'hashedPassword',
        urls: [],
        createdAt: now,
        updatedAt: now,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null); // No existing user
      jest.spyOn(userRepository, 'save').mockResolvedValue(user); // Mock saving user

      const result = await service.create(createUserDto);
      expect(result).toEqual({ id: 1, email: 'test@example.com' });
      expect(userRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          email: createUserDto.email,
        }),
      );
    });

    it('should throw an error if user already exists', async () => {
      const createUserDto = { email: 'test@example.com', password: 'password' };
      const existingUser = {
        id: 1,
        email: createUserDto.email,
        password: 'hashedPassword',
        urls: [],
        createdAt: now,
        updatedAt: now,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(existingUser); // Existing user found

      await expect(service.create(createUserDto)).rejects.toThrowError();
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        urls: [],
        createdAt: now,
        updatedAt: now,
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await service.findByEmail('test@example.com');
      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      const result = await service.findByEmail('notfound@example.com');
      expect(result).toBeNull();
    });
  });
});
