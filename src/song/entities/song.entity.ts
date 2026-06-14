import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Version } from '../enums/version.enum';
import { Genre } from '../enums/genre.enum';
import { Pattern } from 'src/pattern/entities/pattern.entity';

@Entity('songs')
export class Song extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  title: string;

  @Column({ nullable: true })
  artist: string;

  @Column({
    nullable: true,
    type: 'enum', // enum 타입 지정
    enum: Genre, // Genre enum 사용
  })
  genre: Genre;

  // 표기 bpm
  @Column({ nullable: true })
  bpm: number;

  // 최저 bpm
  @Column({ nullable: true })
  minBpm: number;

  // 최고 bpm
  @Column({ nullable: true })
  maxBpm: number;

  @Column({
    nullable: true,
    type: 'enum', // enum 타입 지정
    enum: Version, // Version enum 사용
  })
  version!: Version;

  @OneToMany(() => Pattern, (pattern) => pattern.song)
  patterns?: Pattern[];
}
