import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Region } from "../enums/region.enum";

@Entity('profiles')
export class Profile {
    // 복합 기본 키1
    @PrimaryColumn()
    friendCode: string;

    // 복합 기본 키2
    @PrimaryColumn({
        type: 'enum',
        enum: Region,
    })
    region: Region;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: false, default: 0 })
    maxRating: number;

    @Column({ nullable: false, default: 0 })
    playCount: number;

    @Column({ nullable: false, default: 0 })
    currentRating: number;

    @Column({ nullable: true })
    trophyText: string;

    @Column({ nullable: true })
    trophyType: string;

    @Column({ nullable: true })
    iconUrl: string;

    @Column({ nullable: true })
    courseRank: string;

    @Column({ nullable: true })
    classRank: string;

    @Column({ nullable: false, default: 0 })
    starCount: number;

    // User 엔티티와의 관계 설정 (외래 키)
    @ManyToOne(() => User, user => user.profiles, { nullable: false, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' }) // 외래 키 컬럼 이름을 'user_id'로 설정
    user: User;
}