import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class RawDataItemDto {
  @ApiProperty({
    description: '데이터 취득 경로',
    example: '/maimai-mobile/record',
  })
  @IsString()
  @IsNotEmpty()
  path: string;

  @ApiProperty({
    description: '파싱해온 html 블록',
    example: '<!DOCTYPE html>\n<html lang=\"ja\">\n<hea...',
  })
  @IsString()
  @IsNotEmpty()
  html: string;

  @ApiProperty({
    description: 'html 블록 크기',
    example: '1294171',
  })
  @IsNumber()
  @IsNotEmpty()
  size: number;
}

export class RawDataDto {
  @ApiProperty({
    description: '메인',
  })
  @ValidateNested()
  @Type(() => RawDataItemDto)
  home: RawDataItemDto;

  @ApiProperty({
    description: '유저의 최근 플레이기록 100판이 포함된 블록',
  })
  @ValidateNested()
  @Type(() => RawDataItemDto)
  record: RawDataItemDto;

  @ApiProperty({
    description: '유저 친구 코드 정보가 포함된 블록',
  })
  @ValidateNested()
  @Type(() => RawDataItemDto)
  userFriendCode: RawDataItemDto;

  @ApiProperty({
    description: 'BASIC 난이도의 유저 플레이 기록이 포함된 블록',
  })
  @ValidateNested()
  @Type(() => RawDataItemDto)
  genre99_diff0: RawDataItemDto;

  @ApiProperty({
    description: 'ADVANCED 난이도의 유저 플레이 기록이 포함된 블록',
  })
  @ValidateNested()
  @Type(() => RawDataItemDto)
  genre99_diff1: RawDataItemDto;

  @ApiProperty({
    description: 'EXPERT 난이도의 유저 플레이 기록이 포함된 블록',
  })
  @ValidateNested()
  @Type(() => RawDataItemDto)
  genre99_diff2: RawDataItemDto;

  @ApiProperty({
    description: 'MASTER 난이도의 유저 플레이 기록이 포함된 블록',
  })
  @ValidateNested()
  @Type(() => RawDataItemDto)
  genre99_diff3: RawDataItemDto;

  @ApiProperty({
    description: 'RE:MASTER 난이도의 유저 플레이 기록이 포함된 블록',
  })
  @ValidateNested()
  @Type(() => RawDataItemDto)
  genre99_diff4: RawDataItemDto;
}
