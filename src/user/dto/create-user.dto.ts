import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: '유효하지 않은 이메일 형식입니다.' })
    @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
    email: string;

    @IsNotEmpty()
    password: string;
}
