import { Module } from '@nestjs/common';
import { PatternService } from './pattern.service';
import { PatternController } from './pattern.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pattern } from './entities/pattern.entity';
import { SongModule } from 'src/song/song.module';
import { BullModule } from '@nestjs/bullmq';
import { QUEUE_NAMES } from 'src/infrastructure/queue/queue.constants';
import { PatternProcessor } from 'src/infrastructure/queue/processors/pattern-sync.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pattern]),
    SongModule,
    BullModule.registerQueue(
      { name: QUEUE_NAMES.PATTERN_SYNC }
    ),
  ],
  controllers: [PatternController],
  providers: [PatternService, PatternProcessor],
})
export class PatternModule { }
