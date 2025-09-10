// src/auth/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service'; 
import { UsersModule } from '../users/users.module';
@Module({
  imports: [
    // Make ConfigService available
    ConfigModule,
    UsersModule,
    

    // Passport JWT setup
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Async JWT configuration so we can pull secret from env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (cs: ConfigService) => ({
        secret: cs.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,    // Validates and extracts user from incoming tokens
    JwtAuthGuard,   // Auth guard to protect routes
    RolesGuard,     // Guard to enforce @Roles(...) metadata
  ],
  exports: [
    JwtAuthGuard,   // So other modules can apply @UseGuards(JwtAuthGuard)
    RolesGuard,     // And @UseGuards(RolesGuard)
  ],
})
export class AuthModule {}


