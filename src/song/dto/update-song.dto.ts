import { PartialType } from '@nestjs/mapped-types';
import { CreateSongDto } from './create-song.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Genre } from '../enums/genre.enum';
import { Version } from '../enums/version.enum';

export class UpdateSongDto extends PartialType(CreateSongDto) {
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
    @IsEnum({
        type: "enum", // enum 타입 지정
        enum: Version, // Version enum 사용
    })
    version?: Version;
}
