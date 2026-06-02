import { Difficulty } from "src/profile/enums/difficulty.enum";
import { Song } from "src/song/entities/song.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('patterns')
export class Pattern extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    // 난이도(BASIC, ADVANCED, EXPERT, MASTER, RE:MASTER)
    @Column({ nullable: false, type: 'enum', enum: Difficulty })
    difficulty: Difficulty;

    // 표기 레벨
    @Column({ nullable: false })
    level: string;

    // 내부 상수 레벨
    @Column({ nullable: false })
    internalLevel

    // DX 여부
    @Column({ nullable: true })
    isDx: boolean;

    // 채보 제작자
    @Column({ nullable: true })
    chartDesigner: number;

    // 채보 추천도
    @Column({ nullable: true })
    recommendationScore: number;

    // 체감 난이도
    @Column({ nullable: true })
    perceivedDifficulty: number;

    @ManyToOne(() => Song, song => song.profiles)
    @JoinColumn({ name: 'songId' })
    song: Song;
}
