import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfileTimestamps1781369625181 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "createdAt"`);
    }
}
