import { Module } from '@nestjs/common';
import { PatternService } from './pattern.service';
import { PatternController } from './pattern.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pattern } from './entities/pattern.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pattern])
  ],
  controllers: [PatternController],
  providers: [PatternService],
})
export class PatternModule { }
