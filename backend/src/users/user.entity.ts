import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany } from 'typeorm';
import { Team } from '../teams/team.entity';
import { Project } from '../projects/project.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column('simple-array')
  roles: string[]; // e.g., ['TeamHead']

  @ManyToOne(() => Team, t => t.members, { eager: true })
  team: Team;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true, type: 'varchar', default: null })
  refreshToken?: string | null;

  @ManyToMany(() => Project, p => p.employees)
  projects: Project[];
}
