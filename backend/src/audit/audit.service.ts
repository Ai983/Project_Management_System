import { Injectable } from '@nestjs/common';
import { CreateAuditDto } from './dto/create-audit.dto';
import { ApiTags } from '@nestjs/swagger'; 

@ApiTags('audit')

@Injectable()
export class AuditService {
  // ✅ Fix: specify the type for the in-memory audit array
  private audits: CreateAuditDto[] = [];

  findAll() {
    return this.audits;
  }

  create(dto: CreateAuditDto) {
    this.audits.push(dto);
    return { message: 'Audit entry created', entry: dto };
  }
}
