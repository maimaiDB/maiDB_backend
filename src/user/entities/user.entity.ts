import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * CHECKLIST
 * [ ] TODO: PlayRecord, CustomList과의 관계 설정
 */

@Entity('users') // 테이블 이름을 'users'로 설정
export class User extends BaseEntity {
  // 자동으로 증가하는 숫자형 ID
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  // password 필드는 기본적으로 조회되지 않도록 설정
  // 필요시엔 createQueryBuilder에서 addSelect를 통해 명시적으로 select할 수 있음
  @Column({ select: false })
  password: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ default: 0 })
  playCount: number;

  @Column({ default: 0 })
  maxRating: number;

  @Column({ default: 0 })
  currentRating: number;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
