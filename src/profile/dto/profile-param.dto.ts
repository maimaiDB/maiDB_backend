// profile-param.dto.ts
import { IsEnum, IsString } from 'class-validator';
import { Region } from '../enums/region.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileParamDto {
  @ApiProperty({
    description: '내수/외수 구분',
    example: 'INTERNATIONAL',
  })
  @IsEnum(Region)
  region: Region;

  @ApiProperty({
    description: '친구 코드(숫자 13자리)',
    example: '1234567890123',
  })
  @IsString()
  friendCode: string;
}