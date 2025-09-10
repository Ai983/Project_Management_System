import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private svc: UsersService) {}

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Post()
  @Roles('Director', 'AI Team')
  create(@Body() body: CreateUserDto) {
    return this.svc.create(body);
  }

  @Put(':id')
  @Roles('Director', 'AI Team')
  update(@Param('id') id: string, @Body() body: Partial<CreateUserDto>) {
    return this.svc.update(id, body);
  }
}
