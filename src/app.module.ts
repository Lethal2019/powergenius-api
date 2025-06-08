import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesModule } from './services/services.module';
import { ProjectsModule } from './projects/projects.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { UploadController } from './upload/upload.controller';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: 
  [ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(configService:ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username:configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,

      }),
    }),
    ServicesModule,
    ProjectsModule,
    UserModule,
    AuthModule,
    FeedbackModule,
    CloudinaryModule,
    UploadModule
  ],
  controllers: [AppController, UploadController],
  providers: [AppService, CloudinaryService],
})
export class AppModule {}
