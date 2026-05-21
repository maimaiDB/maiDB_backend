// profile-param.dto.ts
import { IsEnum } from 'class-validator';
import { Region } from '../enums/region.enum';

export class SyncProfileParamDto {
    @IsEnum(Region)
    region: Region;
}