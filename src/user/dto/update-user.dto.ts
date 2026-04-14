import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

// 업데이트 시 필요한 필드만 선택적으로 포함하는 DTO 클래스
// PartialType을 사용하여 CreateUserDto의 모든 필드를 선택적으로 포함하도록 함
export class UpdateUserDto extends PartialType(CreateUserDto) {
    // email, password는 CreateUserDto를 통해 포함됨
    @IsOptional()
    @IsString()
    nickname?: string;

    @IsOptional()
    @IsNumber()
    playCount?: number;

    @IsOptional()
    @IsNumber()
    maxRating?: number;

    @IsOptional()
    @IsNumber()
    currentRating?: number;

    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;

    @IsOptional()
    @IsBoolean()
    isAdmin?: boolean;
}
