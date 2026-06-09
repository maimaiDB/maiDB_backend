import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAMES } from 'src/infrastructure/queue/queue.constants';
import { ProfileProcessor } from 'src/infrastructure/queue/processors/profile-sync.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    // queue 모듈을 ProfileModule에 등록하여 사용할 수 있도록 함
    BullModule.registerQueue(
      { name: QUEUE_NAMES.PROFILE_SYNC }
    ),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileProcessor],
})
export class ProfileModule { }
