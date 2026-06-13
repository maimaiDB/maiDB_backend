// profile-param.dto.ts
import { IsEnum } from 'class-validator';
import { Region } from '../enums/region.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SyncProfileParamDto {
  @ApiProperty({
    description: '내수/외수 구분',
    example: 'INTERNATIONAL',
  })
  @IsEnum(Region)
  region: Region;
}
