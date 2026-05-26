import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class RawDataItemDto {
    @IsString()
    @IsNotEmpty()
    path: string;

    @IsString()
    @IsNotEmpty()
    html: string;

    @IsNumber()
    @IsNotEmpty()
    size: number;
}

export class RawDataDto {
    @ValidateNested()
    @Type(() => RawDataItemDto)
    home: RawDataItemDto;

    @ValidateNested()
    @Type(() => RawDataItemDto)
    record: RawDataItemDto;

    @ValidateNested()
    @Type(() => RawDataItemDto)
    userFriendCode: RawDataItemDto;

    @ValidateNested()
    @Type(() => RawDataItemDto)
    genre99_diff0: RawDataItemDto;

    @ValidateNested()
    @Type(() => RawDataItemDto)
    genre99_diff1: RawDataItemDto;

    @ValidateNested()
    @Type(() => RawDataItemDto)
    genre99_diff2: RawDataItemDto;

    @ValidateNested()
    @Type(() => RawDataItemDto)
    genre99_diff3: RawDataItemDto;

    @ValidateNested()
    @Type(() => RawDataItemDto)
    genre99_diff4: RawDataItemDto;
}