import { IsUUID, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsUUID()
  assigneeId: string;

  @ApiProperty()
  @IsDateString()
  plannedStart: string;

  @ApiProperty()
  @IsDateString()
  plannedEnd: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty({ required: false })
  @IsUUID()
  teamId?: string;
}
