import { Controller, Post, Body, UseGuards, Get, Req, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';


@ApiTags('notifications')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private svc: NotificationsService) {}

  @Post()
  send(@Body() dto: CreateNotificationDto) {
    return this.svc.send(dto);
  }

  @Get()
  async getForUser(@Req() req: Request) {
    // Assume req.user.userId is set by auth middleware
    return this.svc.getForUser((req as any).user?.userId);
  }

  @Get('unread-count')
  async getUnreadCount(@Req() req: Request) {
    const userId = (req as any).user?.userId;
    return this.svc.getUnreadCount(userId);
  }

  @Patch('mark-read')
  async markAllRead(@Req() req: Request) {
    await this.svc.markAsRead((req as any).user?.userId);
    return { success: true };
  }
}

