import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from './service.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Services])],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports:[ServicesService]
})
export class ServicesModule {}
