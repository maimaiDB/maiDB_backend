import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpDto {
    @IsEmail({}, { message: '유효하지 않은 이메일 형식입니다.' })
    @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
    email: string;

    @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
    password: string;
}
