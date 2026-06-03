import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpDto {
    @ApiProperty({
        description: '사용자의 이메일 주소',
        example: 'test@test.com',
    })
    @IsEmail({}, { message: '유효하지 않은 이메일 형식입니다.' })
    @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
    email: string;


    @ApiProperty({
        description: '사용자의 비밀번호',
        example: 'test',
    })
    @IsString({ message: '비밀번호는 문자열이어야 합니다.' })
    @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
    password: string;
}
