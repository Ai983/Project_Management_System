import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { CreateAuditDto } from './dto/create-audit.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('audit')
export class AuditController {
  constructor(private svc: AuditService) {}

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Post()
  create(@Body() dto: CreateAuditDto) {
    return this.svc.create(dto);
  }
}
