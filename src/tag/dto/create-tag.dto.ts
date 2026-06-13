import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    description: '태그명',
    example: '체력',
  })
  @IsNotEmpty()
  @IsString({ message: '태그명은 문자열이어야 합니다.' })
  tagName: string;
}
