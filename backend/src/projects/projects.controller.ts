import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateProjectDto } from './dto/create-project.dto';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private svc: ProjectsService) {}

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.svc.findById(id);
  }

 // @Roles('Director', 'AI Team', 'TeamHead')
  @Roles('Director', 'TeamHead')
  @Post()
  async create(@Body() body: CreateProjectDto) {
    console.log('Received employees:', body.employees, typeof body.employees?.[0]);
    return this.svc.create(body);
  }

  @Roles('Director', 'AI Team', 'TeamHead')
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<CreateProjectDto>) {
    return this.svc.update(id, body);
  }

  @Roles('Director', 'AI Team')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
