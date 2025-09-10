import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuditAndNotificationTables1749803213139 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create audit_log table
        await queryRunner.query(`CREATE TABLE "audit_log" (
            "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            "userId" uuid NOT NULL,
            "entityType" varchar NOT NULL,
            "entityId" uuid NOT NULL,
            "action" varchar NOT NULL,
            "oldValue" text,
            "newValue" text,
            "timestamp" TIMESTAMP DEFAULT now(),
            CONSTRAINT "FK_audit_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
        )`);

        // Create notification table
        await queryRunner.query(`CREATE TABLE "notification" (
            "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
            "userId" uuid NOT NULL,
            "taskId" uuid,
            "channel" varchar NOT NULL,
            "message" text,
            "scheduledAt" timestamp,
            CONSTRAINT "FK_notification_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
            CONSTRAINT "FK_notification_task" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE SET NULL
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP TABLE "audit_log"`);
    }

}
