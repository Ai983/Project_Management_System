import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private repo: Repository<Notification>,
    private gateway: NotificationGateway,
  ) {}

  async send(dto: CreateNotificationDto) {
    const notif = this.repo.create({
      userId: dto.recipientId,
      taskId: dto.taskId,
      channel: dto.type || 'system',
      message: dto.message,
      scheduledAt: new Date(),
    });
    const saved = await this.repo.save(notif);
    // Emit real-time notification
    this.gateway.sendNotification(dto.recipientId, saved);
    return saved;
  }

  async getForUser(userId: string) {
    return this.repo.find({ where: { userId }, order: { scheduledAt: 'DESC' } });
  }

  async markAsRead(userId: string) {
    await this.repo.update({ userId, isRead: false }, { isRead: true });
  }

  async getUnreadCount(userId: string) {
    return this.repo.count({ where: { userId, isRead: false } });
  }
}
