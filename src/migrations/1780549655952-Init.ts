import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1780549655952 implements MigrationInterface {
    name = 'Init1780549655952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."patterns_difficulty_enum" AS ENUM('BASIC', 'ADVANCED', 'EXPERT', 'MASTER', 'RE:MASTER')`);
        await queryRunner.query(`CREATE TABLE "patterns" ("id" SERIAL NOT NULL, "difficulty" "public"."patterns_difficulty_enum" NOT NULL, "level" character varying NOT NULL, "internalLevel" integer, "isDx" boolean NOT NULL, "chartDesigner" character varying, "recommendationScore" character varying, "perceivedDifficulty" character varying, "songId" integer, CONSTRAINT "PK_afb8e3087247ebfc0f30a682a9b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "patterns" ADD CONSTRAINT "FK_f4dafe7bfd08dcdd45e36ce1875" FOREIGN KEY ("songId") REFERENCES "songs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patterns" DROP CONSTRAINT "FK_f4dafe7bfd08dcdd45e36ce1875"`);
        await queryRunner.query(`DROP TABLE "patterns"`);
        await queryRunner.query(`DROP TYPE "public"."patterns_difficulty_enum"`);
    }

}
