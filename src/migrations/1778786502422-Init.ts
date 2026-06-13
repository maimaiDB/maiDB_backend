import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1778786502422 implements MigrationInterface {
  name = 'Init1778786502422';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."profiles_region_enum" AS ENUM('JP', 'GLOBAL')`,
    );
    await queryRunner.query(
      `CREATE TABLE "profiles" ("friendCode" character varying NOT NULL, "region" "public"."profiles_region_enum" NOT NULL, "name" character varying, "maxRating" integer NOT NULL DEFAULT '0', "playCount" integer NOT NULL DEFAULT '0', "currentRating" integer NOT NULL DEFAULT '0', "trophyText" character varying, "trophyType" character varying, "iconUrl" character varying, "courseRank" character varying, "classRank" character varying, "starCount" integer NOT NULL DEFAULT '0', "userId" integer NOT NULL, CONSTRAINT "PK_025ae90980c7a1f88c3e1b3fc31" PRIMARY KEY ("friendCode", "region"))`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "currentRating"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "maxRating"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "playCount"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "nickname"`);
    await queryRunner.query(
      `ALTER TABLE "profiles" ADD CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profiles" DROP CONSTRAINT "FK_315ecd98bd1a42dcf2ec4e2e985"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "nickname" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "playCount" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "maxRating" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "currentRating" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`DROP TABLE "profiles"`);
    await queryRunner.query(`DROP TYPE "public"."profiles_region_enum"`);
  }
}
