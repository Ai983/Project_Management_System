import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @Column('uuid', { nullable: true })
  taskId: string;

  @Column()
  channel: string;

  @Column('text')
  message: string;

  @Column('timestamp', { nullable: true })
  scheduledAt: Date;

  @Column({ default: false })
  isRead: boolean;
} 