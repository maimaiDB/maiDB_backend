import { Injectable } from '@nestjs/common';
import { CreatePatternDto } from './dto/create-pattern.dto';
import { UpdatePatternDto } from './dto/update-pattern.dto';
import { Repository } from 'typeorm';
import { Pattern } from './entities/pattern.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from 'src/song/entities/song.entity';
import { Difficulty } from './enums/difficulty.enum';
import { PatternAlreadyExistsException, PatternNotFoundedException } from 'src/common/exception/service.exception';
import { Queue } from 'bullmq';
import { QUEUE_NAMES } from 'src/infrastructure/queue/queue.constants';
import { InjectQueue } from '@nestjs/bullmq';
import { RawDataDto } from 'src/profile/dto/raw-data.dto';

@Injectable()
export class PatternService {
  constructor(
    @InjectRepository(Pattern)
    private readonly patternRepository: Repository<Pattern>,
    @InjectQueue(QUEUE_NAMES.PATTERN_SYNC)
    private readonly queue: Queue,
  ) { }

  // 정규화 및 패턴 upsert를 수행하기 위한 메세지를 메세지큐에 등록하는 메소드
  async enqueuePatternSync(rawDataDto: RawDataDto) {
    const job = await this.queue.add(
      QUEUE_NAMES.PATTERN_SYNC,
      {
        rawData: rawDataDto,
      },
      {
        attempts: 3, // 최대 재시도 횟수
        backoff: {
          type: 'exponential', // 지수 백오프 전략
          delay: 1000, // 초기 지연 시간 (1초)
        },
        removeOnComplete: true, // 작업 완료 후 자동으로 제거
        removeOnFail: false, // 작업 실패 시 제거하지 않음
      }
    );

    return {
      messageId: job.id
    };
  }

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
    const pattern = await this.patternRepository.findOne({
      where: {
        song: { id: song.id }, // song의 ID를 기준으로 조회
        isDx,
        difficulty,
      },
    });

    return pattern;
  }

  async findPatternByIdOrFail(id: number) {
    const pattern = await this.patternRepository.findOne({
      where: { id },
      relations: ['song'], // 패턴과 연관된 곡 정보도 함께 조회
    });

    if (!pattern) {
      throw PatternNotFoundedException();
    }

    return pattern;
  }

  async findPatterns() {
    return await this.patternRepository.find({
      relations: ['song'], // 패턴과 연관된 곡 정보도 함께 조회
    });
  }


  async updatePattern(patternId: number, updatePatternDto: UpdatePatternDto) {
    const existingPattern = await this.patternRepository.findOne({
      where: { id: patternId },
      relations: ['song'], // song 관계를 명시적으로 로드
    });


    if (!existingPattern) {
      throw PatternNotFoundedException();
    }

    // 기존 패턴에 업데이트 데이터를 병합
    const updatedPattern = this.patternRepository.merge(existingPattern, updatePatternDto);

    // 중복 확인
    if (await this.findPatternByUniqueValue(updatedPattern.song, updatedPattern.isDx, updatedPattern.difficulty)) {
      throw PatternAlreadyExistsException();
    }

    return await this.patternRepository.save(updatedPattern);
  }

  async removePattern(patternId: number) {
    const response = await this.patternRepository.delete({ id: patternId });

    if (response.affected === 0) {
      throw PatternNotFoundedException();
    }

    return response;
  }
}
