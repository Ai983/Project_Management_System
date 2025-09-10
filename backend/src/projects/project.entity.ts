import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('date')
  startDate: string;

  @Column('date')
  endDate: string;

  @ManyToOne(() => User, { eager: true })
  owner: User;

  @OneToMany(() => Task, t => t.project)
  tasks: Task[];

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  employees: User[];
}
