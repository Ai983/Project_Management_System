import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateTeamDto } from './dto/create-team.dto';
import { ApiTags } from '@nestjs/swagger'; 


@ApiTags('teams')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teams')
export class TeamsController {
  constructor(private svc: TeamsService) {}

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Post()
  @Roles('Director', 'AI Team')
  create(@Body() body: CreateTeamDto) {
    return this.svc.create(body);
  }
}
