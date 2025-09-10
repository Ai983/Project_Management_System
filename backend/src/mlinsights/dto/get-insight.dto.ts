import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetInsightDto {
  @ApiProperty()
  @IsUUID()
  taskId: string;
}
