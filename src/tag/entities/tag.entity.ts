import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tags')
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false, unique: true })
    tagName: string;
}
