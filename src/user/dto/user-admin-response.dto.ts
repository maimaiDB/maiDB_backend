import { Expose } from "class-transformer";

export class UserAdminResponseDto {
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