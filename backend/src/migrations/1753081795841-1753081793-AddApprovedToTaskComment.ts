import { MigrationInterface, QueryRunner } from "typeorm";

export class AddApprovedToTaskComment1753081795841 implements MigrationInterface {
    name = 'AddApprovedToTaskComment1753081795841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "task_comment"
            ADD COLUMN "approved" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "task_comment"
            DROP COLUMN "approved"
        `);
    }
}
