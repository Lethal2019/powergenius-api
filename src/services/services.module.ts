import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from './service.entity';
import {ServeStaticModule} from '@nestjs/serve-static';
import {join} from 'path';

@Module({
  imports:[
    TypeOrmModule.forFeature([Services]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: 'uploads',
    }),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports:[ServicesService]
})
export class ServicesModule {}
