import { IsNotEmpty, IsString } from "class-validator";

export class CreateSongDto {
    @IsNotEmpty()
    @IsString({ message: '타이틀은 문자열이어야 합니다.' })
    title: string;
}
