import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Project } from '../projects/project.entity';
import { User } from '../users/user.entity';
import { Team } from '../teams/team.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, p => p.tasks, { eager: true })
  project: Project;

  @Column()
  title: string;

  @ManyToOne(() => User, { eager: true })
  assignee: User;

  @ManyToOne(() => Team, { eager: true, nullable: true })
  team: Team;

  @Column({ nullable: true })
  teamId: string;

  @Column('date')
  plannedStart: string;

  @Column('date')
  plannedEnd: string;

  @Column('date', { nullable: true })
  actualEnd: string;

  @Column('int', { default: 0 })
  percentComplete: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  description: string;
}
