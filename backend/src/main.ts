import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';// ✅ Import cookie-parser
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Middleware
  app.use(helmet());
  app.use(cookieParser()); // ✅ Add this line
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Serve static files from the 'uploads' directory at the project root
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // ✅ Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Project Tracker API')
    .setDescription('API for tracking and managing projects and tasks')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ✅ CORS config for frontend access
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
    ? 'https://project-management-system-frontend-eight.vercel.app' 
    : 'http://localhost:5173',
    credentials: true, // ✅ Allow cookies and headers
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📘 Swagger Docs available at http://localhost:${port}/api`);
}

bootstrap();
