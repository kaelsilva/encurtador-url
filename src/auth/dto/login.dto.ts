import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    type: 'string',
    description: 'E-mail address.',
    example: 'user@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'string',
    description: "User's password.",
    example: 'Asdqwe123!',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
