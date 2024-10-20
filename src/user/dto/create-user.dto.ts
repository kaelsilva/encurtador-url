import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    description: 'Unique e-mail address.',
    example: 'user@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'Strong password.',
    example: 'secretPassword1',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
