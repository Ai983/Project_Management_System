import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './team.entity';

@Injectable()
export class TeamsService {
  constructor(@InjectRepository(Team) private repo: Repository<Team>) {}

  findAll() {
    return this.repo.find({ relations: ['members'] });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['members'] });
  }

  create(dto: { name: string }) {
    const team = this.repo.create(dto);
    return this.repo.save(team);
  }
}
