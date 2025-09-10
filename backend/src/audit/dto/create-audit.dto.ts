import { IsUUID, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuditDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsString()
  entityType: string;

  @ApiProperty()
  @IsUUID()
  entityId: string;

  @ApiProperty()
  @IsString()
  action: string;

  @ApiProperty()
  @IsString()
  oldValue: string;

  @ApiProperty()
  @IsString()
  newValue: string;
}
