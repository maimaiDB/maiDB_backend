import { Injectable } from '@nestjs/common';
import { CreatePatternDto } from './dto/create-pattern.dto';
import { UpdatePatternDto } from './dto/update-pattern.dto';
import { Repository } from 'typeorm';
import { Pattern } from './entities/pattern.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/song/entities/song.entity';

@Injectable()
export class PatternService {
  constructor(
    @InjectRepository(Pattern)
    private readonly patternRepository: Repository<Pattern>,
  ) { }

  async createPattern(createPatternDto: CreatePatternDto, song: Song) {
    const newPattern = this.patternRepository.create({
      ...createPatternDto,
      song,
    });
  }

  findAll() {
    return `This action returns all pattern`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pattern`;
  }

  update(id: number, updatePatternDto: UpdatePatternDto) {
    return `This action updates a #${id} pattern`;
  }

  remove(id: number) {
    return `This action removes a #${id} pattern`;
  }
}
