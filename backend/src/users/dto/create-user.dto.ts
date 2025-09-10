import { IsEmail, IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  role: string;

  @ApiProperty()
  @IsUUID()
  teamId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;
}

