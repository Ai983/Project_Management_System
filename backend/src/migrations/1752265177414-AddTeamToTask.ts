import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTeamToTask1752265177414 implements MigrationInterface {
    name = 'AddTeamToTask1752265177414'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_comment" DROP CONSTRAINT "FK_task"`);
        await queryRunner.query(`ALTER TABLE "task_comment" DROP CONSTRAINT "FK_user"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_notification_user"`);
        await queryRunner.query(`ALTER TABLE "notification" DROP CONSTRAINT "FK_notification_task"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "teamId" uuid`);
        await queryRunner.query(`ALTER TABLE "task_comment" ALTER COLUMN "createdAt" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "message" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "isRead" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_de59b0c5e20f83310101e5ca835" FOREIGN KEY ("teamId") REFERENCES "team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_comment" ADD CONSTRAINT "FK_0fed042ede2365de8b32e105cc6" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_comment" ADD CONSTRAINT "FK_5e92c87acf1a8ed40db144e2bdd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_comment" DROP CONSTRAINT "FK_5e92c87acf1a8ed40db144e2bdd"`);
        await queryRunner.query(`ALTER TABLE "task_comment" DROP CONSTRAINT "FK_0fed042ede2365de8b32e105cc6"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_de59b0c5e20f83310101e5ca835"`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "isRead" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notification" ALTER COLUMN "message" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task_comment" ALTER COLUMN "createdAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "teamId"`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_notification_task" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notification" ADD CONSTRAINT "FK_notification_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_comment" ADD CONSTRAINT "FK_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_comment" ADD CONSTRAINT "FK_task" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
