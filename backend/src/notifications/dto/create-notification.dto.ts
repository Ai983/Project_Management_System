import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty()
  @IsUUID()
  recipientId: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty({ default: 'email' })
  @IsString()
  type: string;

  @ApiProperty({ required: false })
  @IsUUID()
  taskId?: string;
}
