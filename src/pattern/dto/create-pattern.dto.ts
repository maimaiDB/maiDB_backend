import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Difficulty } from "../enums/difficulty.enum";

export class CreatePatternDto {
    @IsNotEmpty()
    @IsEnum(Difficulty, { message: '난이도는 유효한 Difficulty enum 값이어야 합니다.' })
    difficulty: Difficulty;

    @IsNotEmpty()
    @IsString({ message: '표기 레벨은 문자열이어야 합니다.' })
    level: string;

    @IsOptional()
    @IsNumber({}, { message: '내부 상수는 숫자여야 합니다.' })
    internalLevel?: number;

    @IsOptional()
    @IsBoolean({ message: '체감 난이도는 bool이어야 합니다.' })
    isDx?: boolean;

    @IsOptional()
    @IsString({ message: '채보제작자는 문자열이어야 합니다.' })
    chartDesigner?: string;

    /**
     * CHECKLIST
     * [ ] TODO: 노래 추천도와 체감 난이도는 추후 enum으로 변경
     */
    @IsOptional()
    @IsString({ message: '노래 추천도는 문자열이어야 합니다.' })
    recommendationScore?: string;

    @IsOptional()
    @IsString({ message: '체감 난이도는 문자열이어야 합니다.' })
    perceivedDifficulty?: string;
}
