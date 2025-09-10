import { Injectable } from '@nestjs/common';

@Injectable()
export class SchedulerService {
  runReminderJob() {
    return { message: 'Reminder job triggered (mock)' };
  }
}
