// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import { Response } from 'express'; // ✅ import express.Response
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid password');

    return user;
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.validateUser(dto.email, dto.password);

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      teamId: user.team?.id ?? null,
    };

    const token = this.jwtService.sign(payload);
    // Generate refresh token
    const refreshToken = randomBytes(64).toString('hex');
    await this.usersService.saveRefreshToken(user.id, refreshToken);

    // Set tokens in cookies
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 min access token
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { message: 'Login successful', userId: user.id, role: user.roles[0] };
  }

  async refresh(req: any, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new UnauthorizedException('No refresh token');
    const user = await this.usersService.findByRefreshToken(refreshToken);
    if (!user) throw new UnauthorizedException('Invalid refresh token');
    // Rotate refresh token
    const newRefreshToken = randomBytes(64).toString('hex');
    await this.usersService.saveRefreshToken(user.id, newRefreshToken);
    // Issue new access token
    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
      teamId: user.team?.id ?? null,
    };
    const token = this.jwtService.sign(payload);
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { message: 'Token refreshed' };
  }

  async logout(res: Response, userId: string) {
    await this.usersService.saveRefreshToken(userId, null);
    res.clearCookie('jwt');
    res.clearCookie('refreshToken');
    return { message: 'Logged out' };
  }
}
