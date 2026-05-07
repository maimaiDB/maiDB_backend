import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Version } from "../enums/version.enum";
import { Genre } from "../enums/genre.enum";

@Entity('songs')
export class Song extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column()
    artist: string;

    // 범주명
    @Column({
        type: "enum", // enum 타입 지정
        enum: Genre, // Genre enum 사용
    })
    genre: Genre;

    // 표기 bpm
    @Column()
    bpm: number;

    // 최저 bpm
    @Column()
    minBpm: number;

    // 최고 bpm
    @Column()
    maxBpm: number;

    @Column({
        type: "enum", // enum 타입 지정
        enum: Version, // Version enum 사용
    })
    version: Version;
}
