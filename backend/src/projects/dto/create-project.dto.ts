import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  startDate: string;

  @ApiProperty()
  @IsString()
  endDate: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
/// @IsUUID('all', { each: true })
  employees?: string[];
}
