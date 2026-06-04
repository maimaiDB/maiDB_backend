import { PartialType } from '@nestjs/swagger';
import { CreatePatternDto } from './create-pattern.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdatePatternDto extends PartialType(CreatePatternDto) {
    @IsOptional()
    @IsNumber({}, { message: '노래id는 숫자여야 합니다.' })
    songId?: number;
}
