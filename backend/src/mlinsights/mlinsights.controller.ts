import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MlinsightsService } from './mlinsights.service';
import { GetInsightDto } from './dto/get-insight.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('mlinsights')
@UseGuards(JwtAuthGuard)
@Controller('mlinsights')
export class MlinsightsController {
  constructor(private svc: MlinsightsService) {}

  @Post('predict-delay')
  predict(@Body() dto: GetInsightDto) {
    return this.svc.predictDelay(dto.taskId);
  }
}
