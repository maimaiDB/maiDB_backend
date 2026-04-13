import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: '유효하지 않은 이메일 형식입니다.' })
    userEmail: string;

    @IsNotEmpty()
    password: string;
}
