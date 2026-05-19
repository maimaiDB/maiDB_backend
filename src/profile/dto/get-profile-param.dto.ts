// profile-param.dto.ts
import { IsEnum, IsString } from 'class-validator';
import { Region } from '../enums/region.enum';

export class GetProfileParamDto {
  @IsEnum(Region)
  region: Region;

  @IsString()
  friendCode: string;
}