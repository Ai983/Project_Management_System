import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjectEmployeesRelation1751529436275 implements MigrationInterface {
    name = 'AddProjectEmployeesRelation1751529436275'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project_employees_user" ("projectId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_d585f55eaaf8fe69b67feb7a993" PRIMARY KEY ("projectId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1175a485b44e167df8ed76b7ec" ON "project_employees_user" ("projectId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3b5b33c244a33e9b085ead53ef" ON "project_employees_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "project_employees_user" ADD CONSTRAINT "FK_1175a485b44e167df8ed76b7ec5" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_employees_user" ADD CONSTRAINT "FK_3b5b33c244a33e9b085ead53ef3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_employees_user" DROP CONSTRAINT "FK_3b5b33c244a33e9b085ead53ef3"`);
        await queryRunner.query(`ALTER TABLE "project_employees_user" DROP CONSTRAINT "FK_1175a485b44e167df8ed76b7ec5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3b5b33c244a33e9b085ead53ef"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1175a485b44e167df8ed76b7ec"`);
        await queryRunner.query(`DROP TABLE "project_employees_user"`);
    }

}

export class AddDescriptionToTask1680000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD COLUMN "description" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "description"`);
    }
}

export class AddIsReadToNotification1680000000001 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" ADD COLUMN "isRead" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "isRead"`);
    }
}

export class CreateTaskComment1680000000002 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task_comment" (
            "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            "comment" text NOT NULL,
            "attachment" character varying,
            "createdAt" TIMESTAMP DEFAULT now(),
            "taskId" uuid,
            "userId" uuid,
            CONSTRAINT "FK_task" FOREIGN KEY ("taskId") REFERENCES "task" ("id") ON DELETE CASCADE,
            CONSTRAINT "FK_user" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "task_comment"`);
    }
}

export class AddRefreshTokenToUser1680000000003 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD COLUMN "refreshToken" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshToken"`);
    }
}
