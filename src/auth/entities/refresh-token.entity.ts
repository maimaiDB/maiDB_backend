import { User } from "src/user/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

/**
 * CHECKLIST
 * [x] TODO: USER와의 관계 설정
 */

@Entity('refresh_tokens') // 테이블 이름을 'refresh_tokens'로 설정
export class RefreshToken extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    token: string;

    @Column({ nullable: false })
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(
        () => User,
        user => user.refreshTokens,
        { nullable: false, onDelete: 'CASCADE' }
    )
    @JoinColumn({ name: 'userId' })
    userId: number;
}
