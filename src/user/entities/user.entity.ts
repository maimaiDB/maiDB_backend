import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // soft delete를 위한 deletedAt 컬럼
  // 삭제 시 해당 컬럼에 삭제 시각이 기록되고 실제 데이터는 삭제되지 않음  
  // deletedAt이 null이 아닌 경우 해당 레코드는 find()시 조회되지 않음
  // 실제 쿼리 : SELECT * FROM users WHERE deletedAt IS NULL;
  // 삭제된 데이터까지 조회하려면 find시 find({withDeleted: true}) 옵션을 사용해야 함
  @DeleteDateColumn()
  deletedAt: Date | null;
}
