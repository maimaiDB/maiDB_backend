import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Genre } from '../enums/genre.enum';
import { Version } from '../enums/version.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSongDto {
  @ApiProperty({
    description: '노래 타이틀',
    example: '超熊猫的周遊記（ワンダーパンダートラベラー）',
  })
  @IsNotEmpty()
  @IsString({ message: '타이틀은 문자열이어야 합니다.' })
  title: string;

  @ApiProperty({
    description: '노래 아티스트',
    example: 'FANTAGIRAFF',
  })
  @IsOptional()
  @IsString({ message: '아티스트는 문자열이어야 합니다.' })
  artist?: string;

  @ApiProperty({
    description: '장르 (마이마이 분류)',
    example: 'maimai',
  })
  @IsOptional()
  @IsEnum(Genre, { message: '장르는 유효한 Genre enum 값이어야 합니다.' })
  genre?: Genre;

  @ApiProperty({
    description: '표기 bpm',
    example: '121',
  })
  @IsOptional()
  @IsNumber({}, { message: '표기 bpm은 숫자여야 합니다.' })
  bpm?: number;

  @ApiProperty({
    description: '최저 bpm',
    example: '121',
  })
  @IsOptional()
  @IsNumber({}, { message: '최저bpm은 숫자여야 합니다.' })
  minBpm?: number;

  @ApiProperty({
    description: '최고 bpm',
    example: '158',
  })
  @IsOptional()
  @IsNumber({}, { message: '최고bpm은 숫자여야 합니다.' })
  maxBpm?: number;

  @ApiProperty({
    description: '수록 버전',
    example: 'FESTiVAL PLUS',
  })
  @IsOptional()
  @IsEnum(Version, {
    message: '수록 버전은 유효한 Version enum 값이어야 합니다.',
  })
  version?: Version;
}
