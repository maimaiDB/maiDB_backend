import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1778588231681 implements MigrationInterface {
  name = 'Init1778588231681';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "songs" ADD CONSTRAINT "UQ_e84a24f0f8d94d5699f32797fbd" UNIQUE ("title")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "songs" DROP CONSTRAINT "UQ_e84a24f0f8d94d5699f32797fbd"`,
    );
  }
}
