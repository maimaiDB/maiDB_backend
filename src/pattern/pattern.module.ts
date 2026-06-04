import { Module } from '@nestjs/common';
import { PatternService } from './pattern.service';
import { PatternController } from './pattern.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pattern } from './entities/pattern.entity';
import { SongModule } from 'src/song/song.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pattern]),
    SongModule
  ],
  controllers: [PatternController],
  providers: [PatternService],
})
export class PatternModule { }
