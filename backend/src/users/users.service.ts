// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  findAll() {
    return this.repo.find();
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async create(dto: Partial<User>) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = this.repo.create({
      ...dto,
      password: hashedPassword,
    });

    return this.repo.save(user);
  }

  update(id: string, dto: Partial<User>) {
    return this.repo.update(id, dto);
  }

  async upsertFromAuth0(profile: { sub: string; email: string; roles: string[]; teamId: string }) {
    let user = await this.repo.findOne({ where: { id: profile.sub } });
    if (!user) {
      user = this.repo.create({
        id: profile.sub,
        email: profile.email,
        roles: profile.roles,
        team: { id: profile.teamId },
      });
    } else {
      user.roles = profile.roles;
      user.team = { id: profile.teamId } as any;
    }
    return this.repo.save(user);
  }

  async saveRefreshToken(userId: string, refreshToken: string | null) {
    await this.repo.update(userId, { refreshToken });
  }

  findByRefreshToken(refreshToken: string) {
    return this.repo.findOne({ where: { refreshToken } });
  }
}
