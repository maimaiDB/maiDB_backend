import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1778171560144 implements MigrationInterface {
  name = 'Init1778171560144';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."songs_genre_enum" AS ENUM('POPS＆アニメ', 'niconico＆ボーカロイド', '東方Project', 'ゲーム＆バラエティ', 'maimai', 'オンゲキ＆CHUNITHM', '宴会場')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."songs_version_enum" AS ENUM('maimai', 'maimai PLUS', 'GreeN', 'GreeN PLUS', 'ORAGNE', 'ORAGNE PLUS', 'PiNK', 'PiNK PLUS', 'MURASAKi', 'MURASAKi PLUS', 'MiLK', 'MiLK PLUS', 'FiNALE', 'DX', 'DX PLUS', 'Splash', 'Splash PLUS', 'UNiVERSE', 'UNiVERSE PLUS', 'FESTiVAL', 'FESTiVAL PLUS', 'BUDDiES', 'BUDDiES PLUS', 'PRiSM', 'PRiSM PLUS', 'CiRCLE', 'CiRCLE PLUS')`,
    );
    await queryRunner.query(
      `CREATE TABLE "songs" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "artist" character varying, "genre" "public"."songs_genre_enum", "bpm" integer, "minBpm" integer, "maxBpm" integer, "version" "public"."songs_version_enum", CONSTRAINT "PK_e504ce8ad2e291d3a1d8f1ea2f4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`,
    );
    await queryRunner.query(`DROP TABLE "songs"`);
    await queryRunner.query(`DROP TYPE "public"."songs_version_enum"`);
    await queryRunner.query(`DROP TYPE "public"."songs_genre_enum"`);
  }
}
