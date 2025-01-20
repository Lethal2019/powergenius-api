import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'),{
    prefix: '/uploads',
  });

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Allow frontend requests
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you're using cookies or credentials
  });



  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
