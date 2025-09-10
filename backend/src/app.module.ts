import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';

import { WebsocketModule } from './websocket/websocket.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { MlinsightsModule } from './mlinsights/mlinsights.module';
import { NotificationsModule } from './notifications/notifications.module';




import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (cs: ConfigService) => {

        if (process.env.NODE_ENV === 'production'){
          return {
            type: 'postgres',
            url: cs.get('DATABASE_URL'),
            ssl: {
              rejectUnauthorized: false,
            },
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            migrations: [__dirname + '/../migrations/*{.ts,.js}'],
            synchronize: false,
          };
        }
      
      return {
        type: 'postgres',
        host: cs.get('DB_HOST'),
        port: +cs.get('DB_PORT'),
        username: cs.get('DB_USERNAME'),
        password: cs.get('DB_PASSWORD'),
        database: cs.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../migrations/*{.ts,.js}'],
        synchronize: false,  // use migrations!
      };
    },
    inject: [ConfigService],
  }),
    AuthModule,
    UsersModule,
    TeamsModule,
    ProjectsModule,
    TasksModule,
    AuditModule,
    NotificationsModule,
    MlinsightsModule,
    SchedulerModule,
    WebsocketModule,
  ],
})
export class AppModule {}
