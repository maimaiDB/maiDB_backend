import { Expose } from "class-transformer";

// 유저 정보를 반환하는 DTO 클래스(일반 권한)
export class PublicUserResponseDto {
    @Expose()
    maxRating: number;

    @Expose()
    currentRating: number;
}