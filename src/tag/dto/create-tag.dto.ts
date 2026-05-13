import { IsNotEmpty, IsString } from "class-validator";

export class CreateTagDto {
    @IsNotEmpty()
    @IsString({ message: '태그명은 문자열이어야 합니다.' })
    tagName: string;
}
