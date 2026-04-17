import { IsNotEmpty, IsString } from "class-validator";

export class LogoutDto {
    @IsString({ message: '리프레시 토큰은 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '리프레시 토큰은 필수 입력 항목입니다.' })
    refreshToken: string;
}
