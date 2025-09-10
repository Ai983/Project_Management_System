import { Module } from '@nestjs/common';
import { MlinsightsService } from './mlinsights.service';
import { MlinsightsController } from './mlinsights.controller';


@Module({
  providers: [MlinsightsService],
  controllers: [MlinsightsController],
})
export class MlinsightsModule {}
