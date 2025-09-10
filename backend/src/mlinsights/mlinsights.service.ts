import { Injectable } from '@nestjs/common';

@Injectable()
export class MlinsightsService {
  predictDelay(taskId: string) {
    // Mock prediction
    return {
      taskId,
      riskScore: Math.random().toFixed(2),
      status: 'at risk',
    };
  }
}
