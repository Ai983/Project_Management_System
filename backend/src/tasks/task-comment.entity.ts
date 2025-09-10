import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Task } from './task.entity';
import { User } from '../users/user.entity';

@Entity()
export class TaskComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Task, { eager: true })
  task: Task;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column('text')
  comment: string;

  @Column({ nullable: true })
  attachment: string;

  @Column({ default: false })
  approved: boolean;

  @CreateDateColumn()
  createdAt: Date;
} 