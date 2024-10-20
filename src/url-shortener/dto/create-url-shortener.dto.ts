import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUrlShortenerDto {
  @ApiProperty({
    type: 'string',
    description: 'URL to be shortened.',
    example: 'https://google.com.br',
  })
  @IsNotEmpty()
  url: string;
}
