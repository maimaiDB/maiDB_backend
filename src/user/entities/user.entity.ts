import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

/**
 * CHECKLIST
 * [ ] TODO: PlayRecord, CustomList과의 관계 설정
 */

@Entity('users') // 테이블 이름을 'users'로 설정
export class User extends BaseEntity {
  // uuid 형태로 id를 자동으로 생성하도록 설정
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  maxRating: number;

  @Column({ nullable: true })
  currentRating: number;

  @Column({ default: false })
  isAdmin: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
