import { Controller, Post, UseGuards } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('scheduler')
@UseGuards(JwtAuthGuard)
@Controller('scheduler')
export class SchedulerController {
  constructor(private svc: SchedulerService) {}

  @Post('trigger-reminders')
  trigger() {
    return this.svc.runReminderJob();
  }
}

