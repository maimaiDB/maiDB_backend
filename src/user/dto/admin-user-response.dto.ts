import { Expose } from "class-transformer";

// 유저 정보를 디테일하게 반환하는 DTO 클래스(관리자 권한)
export class AdminUserResponseDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    maxRating: number;

    @Expose()
    currentRating: number;

    @Expose()
    isAdmin: boolean;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    deletedAt: Date | null;
}