import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { ProfileProcessor } from './profile.processor';
import { QueueModule } from 'src/infrastructure/queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    // queue 모듈을 ProfileModule에 등록하여 사용할 수 있도록 함
    QueueModule
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileProcessor],
})
export class ProfileModule { }
