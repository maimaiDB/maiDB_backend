import { Injectable } from '@nestjs/common';
import { CreatePatternDto } from './dto/create-pattern.dto';
import { UpdatePatternDto } from './dto/update-pattern.dto';
import { Repository } from 'typeorm';
import { Pattern } from './entities/pattern.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/song/entities/song.entity';
import { Difficulty } from './enums/difficulty.enum';
import { PatternAlreadyExistsException } from 'src/common/exception/service.exception';

@Injectable()
export class PatternService {
  constructor(
    @InjectRepository(Pattern)
    private readonly patternRepository: Repository<Pattern>,
  ) { }

  async createPattern(createPatternDto: CreatePatternDto, song: Song) {
    // pattern을 생성하기 전 중복된 데이터가 DB에 없는지 먼저 확인
    if (await this.findPatternByUniqueValue(song, createPatternDto.isDx, createPatternDto.difficulty)) {
      throw PatternAlreadyExistsException();
    }

    const newPattern = this.patternRepository.create({
      ...createPatternDto,
      song,
    });

    return await this.patternRepository.save(newPattern);
  }

  // 곡, DX여부, 난이도의 조합으로 패턴을 조회하는 메소드
  async findPatternByUniqueValue(song: Song, isDx: boolean, difficulty: Difficulty) {
    const Pattern = await this.patternRepository.findOne({
      where: {
        song: { id: song.id }, // song의 ID를 기준으로 조회
        isDx,
        difficulty,
      },
    });

    return Pattern;
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
