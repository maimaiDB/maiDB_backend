import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1779192700932 implements MigrationInterface {
    name = 'Init1779192700932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."profiles_region_enum" RENAME TO "profiles_region_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."profiles_region_enum" AS ENUM('JP', 'INTERNATIONAL')`);
        await queryRunner.query(`ALTER TABLE "profiles" ALTER COLUMN "region" TYPE "public"."profiles_region_enum" USING "region"::"text"::"public"."profiles_region_enum"`);
        await queryRunner.query(`DROP TYPE "public"."profiles_region_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."profiles_region_enum_old" AS ENUM('JP', 'GLOBAL')`);
        await queryRunner.query(`ALTER TABLE "profiles" ALTER COLUMN "region" TYPE "public"."profiles_region_enum_old" USING "region"::"text"::"public"."profiles_region_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."profiles_region_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."profiles_region_enum_old" RENAME TO "profiles_region_enum"`);
    }

}
