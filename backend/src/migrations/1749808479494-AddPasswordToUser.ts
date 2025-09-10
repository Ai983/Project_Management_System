import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordToUser1749808479494 implements MigrationInterface {
    name = 'AddPasswordToUser1749808479494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add password column as nullable first since we have existing users
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying`);
        
        // Set a default password for existing users (you should change these later)
        await queryRunner.query(`UPDATE "user" SET "password" = 'temp123' WHERE "password" IS NULL`);
        
        // Now make the column NOT NULL
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "password" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    }

}
