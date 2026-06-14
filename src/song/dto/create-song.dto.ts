import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Genre } from '../enums/genre.enum';
import { Version } from '../enums/version.enum';
import { Locale } from '../enums/locale.enum';

export class CreateSongDto {
  @IsNotEmpty()
  @IsString({ message: '타이틀은 문자열이어야 합니다.' })
  title!: string;

  @IsOptional()
  @IsString({ message: '아티스트는 문자열이어야 합니다.' })
  artist?: string;

  @IsOptional()
  @IsEnum(Genre, { message: '장르는 유효한 Genre enum 값이어야 합니다.' })
  genre?: Genre;

  @IsOptional()
  @IsNumber({}, { message: 'bpm은 숫자여야 합니다.' })
  bpm?: number;

  @IsOptional()
  @IsNumber({}, { message: '최저bpm은 숫자여야 합니다.' })
  minBpm?: number;

  @IsOptional()
  @IsNumber({}, { message: '최고bpm은 숫자여야 합니다.' })
  maxBpm?: number;

  @IsOptional()
  @IsEnum(Version, { message: '버전은 유효한 Version enum 값이어야 합니다.' })
  version?: Version;

  @IsOptional()
  @IsEnum(Locale, { message: '로케일은 유효한 Locale enum 값이어야 합니다.' })
  locale?: Locale;
}
