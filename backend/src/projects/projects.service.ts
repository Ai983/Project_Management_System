import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { User } from '../users/user.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { TasksService } from '../tasks/tasks.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateNotificationDto } from '../notifications/dto/create-notification.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private repo: Repository<Project>,
    private tasksService: TasksService,
    private notificationsService: NotificationsService,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['owner', 'tasks'] });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['owner', 'tasks'] });
  }

  async create(data: CreateProjectDto) {
    const { employees: employeeIds, ...projectData } = data;
    let employees: User[] = [];
    if (employeeIds && employeeIds.length > 0) {
      employees = await this.repo.manager.getRepository(User).findByIds(employeeIds);
    }
    const proj = this.repo.create({ ...projectData, employees });
    const savedProject = await this.repo.save(proj);

    // Create a task for each employee and send notification
    for (const employee of employees) {
      const task = await this.tasksService.create({
        project: savedProject,
        assignee: employee,
        title: savedProject.name,
        description: savedProject.description,
        plannedStart: savedProject.startDate,
        plannedEnd: savedProject.endDate,
        status: 'Not Started',
        percentComplete: 0,
      });
      // Send notification
      const notification: CreateNotificationDto = {
        recipientId: employee.id,
        message: `You have been assigned a new project: ${savedProject.name}`,
        type: 'system',
      };
      this.notificationsService.send(notification);
    }
    return savedProject;
  }

  async update(id: string, data: Partial<CreateProjectDto>) {
    const { employees: employeeIds, ...projectData } = data;
    // Load the existing project
    const project = await this.repo.findOne({ where: { id }, relations: ['employees'] });
    if (!project) throw new Error('Project not found');

    // Update scalar fields
    Object.assign(project, projectData);

    // Update employees relation if provided
    if (employeeIds && Array.isArray(employeeIds)) {
      const employeeEntities = await this.repo.manager.getRepository(User).findByIds(employeeIds);
      project.employees = employeeEntities;
    }

    // Save the updated project (this will update both fields and relations)
    await this.repo.save(project);

    // Optionally update related tasks, etc.
    await this.tasksService.updateTasksForProject(id, {
      title: projectData.name,
      description: projectData.description,
      plannedStart: projectData.startDate,
      plannedEnd: projectData.endDate,
    });

    return this.findById(id);
  }

  remove(id: string) {
    return this.repo.delete(id);
  }
}
