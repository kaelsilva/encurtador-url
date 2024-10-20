import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  public async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;

      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (existingUser) {
        throw new HttpException(
          'User with this email already exists.',
          HttpStatus.CONFLICT,
        );
      }

      const user: User = new User();
      user.email = email;

      const hashedPassword = await this.hashPassword(password);
      user.password = hashedPassword;

      const createdUser = await this.userRepository.save(user);

      return { id: createdUser.id, email: createdUser.email };
    } catch (error: any) {
      throw error;
    }
  }
  async findAll() {
    return await this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
}
