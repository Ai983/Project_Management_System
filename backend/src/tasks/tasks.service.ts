import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskComment } from './task-comment.entity';
import { Team } from '../teams/team.entity';
import { User } from '../users/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private repo: Repository<Task>,
    @InjectRepository(TaskComment) private commentRepo: Repository<TaskComment>,
    @InjectRepository(Team) private teamRepo: Repository<Team>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async findAll(projectId?: string, user?: any, teamId?: string) {
    // If user is Employee, return only their tasks
    if (user?.roles?.includes('TeamMember')) {
      return this.repo.find({
        where: {
          assignee: { id: user.userId },
          ...(projectId ? { project: { id: projectId } } : {}),
          ...(teamId ? { team: { id: teamId } } : {}),
        },
        relations: ['assignee', 'project', 'team'],
      });
    }
    // Director/TeamHead: return all tasks (optionally filtered by project or team)
    return this.repo.find({
      where: {
        ...(projectId ? { project: { id: projectId } } : {}),
        ...(teamId ? { team: { id: teamId } } : {}),
      },
      relations: ['assignee', 'project', 'team'],
    });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<Task>) {
    let team: Team | undefined = undefined;
    if (data.teamId) {
      const foundTeam = await this.teamRepo.findOne({ where: { id: data.teamId } });
      if (foundTeam) team = foundTeam;
    }
    const t = this.repo.create({ ...data, team });
    return this.repo.save(t);
  }

  async update(id: string, data: Partial<Task>, user?: any) {
    const task = await this.repo.findOne({ where: { id }, relations: ['assignee', 'assignee.team'] });
    if (!task) throw new Error('Task not found');
    // Allow if user is the assignee
    if (task.assignee?.id === user?.userId || user?.roles?.includes('Director') || user?.roles?.includes('TeamHead') || (user?.roles?.includes('TeamHead') && user?.teamId === task.assignee?.team?.id)) {
      // Automatic progress update
      let percentComplete = data.percentComplete;
      if (data.status) {
        if (data.status === 'Not Started') percentComplete = 0;
        else if (data.status === 'Started') percentComplete = 25;
        else if (data.status === 'In Progress') percentComplete = 50;
        else if (data.status === 'Completed') percentComplete = 100;
      }
      return this.repo.update(id, { ...data, percentComplete });
    }
    throw new ForbiddenException('You do not have permission to update this task');
  }

  remove(id: string) {
    return this.repo.delete(id);
  }

  async updateTasksForProject(projectId: string, update: Partial<Task>) {
    const tasks = await this.repo.find({ where: { project: { id: projectId } } });
    for (const task of tasks) {
      await this.repo.update(task.id, update);
    }
  }

  async addComment(taskId: string, userId: string, comment: string, attachment?: string) {
    console.log('Adding comment:', { taskId, userId, comment, attachment });
    const task = await this.repo.findOne({ where: { id: taskId } });
    if (!task) throw new Error('Task not found');
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    const c = this.commentRepo.create({ task, user, comment, attachment });
    const saved = await this.commentRepo.save(c);
    console.log('Comment saved:', saved);
    return saved;
  }

  async getComments(taskId: string) {
    console.log('Getting comments for task:', taskId);
    const comments = await this.commentRepo.find({ 
      where: { task: { id: taskId } }, 
      relations: ['user'],
      order: { createdAt: 'ASC' } 
    });
    console.log('Found comments:', comments);
    return comments;
  }

  async approveComment(commentId: string, approved: boolean) {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new Error('Comment not found');
    comment.approved = approved;
    return this.commentRepo.save(comment);
  }

  async testCommentFunctionality() {
    try {
      const count = await this.commentRepo.count();
      console.log('Total comments in database:', count);
      return { success: true, commentCount: count };
    } catch (error) {
      console.error('Error testing comment functionality:', error);
      return { success: false, error: error.message };
    }
  }
}
