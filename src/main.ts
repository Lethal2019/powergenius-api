// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { join } from 'path'; // <-- REMOVE THIS
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // REMOVE THIS BLOCK - NO LONGER SERVING LOCAL IMAGES
  // app.useStaticAssets(join(__dirname, '..', 'uploads'), {
  //   prefix: '/uploads/',
  // });

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://powergeniusengineering.vercel.app',
      'https://power-genius.vercel.app',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();