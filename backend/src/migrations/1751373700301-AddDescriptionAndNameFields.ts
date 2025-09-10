import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDescriptionAndNameFields1751373700301 implements MigrationInterface {
    name = 'AddDescriptionAndNameFields1751373700301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying`);
        await queryRunner.query(`ALTER TABLE "project" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    }

}
