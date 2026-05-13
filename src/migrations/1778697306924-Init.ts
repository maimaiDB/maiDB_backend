import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1778697306924 implements MigrationInterface {
    name = 'Init1778697306924'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "tagName" character varying NOT NULL, CONSTRAINT "UQ_a0e006b29d7876b2f5a4df70a37" UNIQUE ("tagName"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tags"`);
    }

}
