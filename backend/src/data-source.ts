// src/data-source.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL, // 👈 use Neon connection string
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false, // 👈 SSL for Neon
  entities: [__dirname + '/*/.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});
