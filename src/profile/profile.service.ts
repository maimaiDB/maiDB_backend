import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Region } from './enums/region.enum';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { ProfileNotFoundedException } from 'src/common/exception/service.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectQueue('test-queue')
    private readonly queue: Queue,
  ) { }

  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  async queueTest() {
    const job = await this.queue.add(
      'test-job',
      { data: 'Hello, BullMQ!' },
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

  async findProfileOrFail(region: Region, friendCode: string) {
    const profile = await this.profileRepository.findOne({ where: { region, friendCode } });

    if (!profile) {
      throw ProfileNotFoundedException();
    }

    return profile;
  }

  async isProfileExistByRegionAndUserId(region: Region, user: User): Promise<boolean> {
    console.log("isProfileExistByRegionAndUserId called with region:", region, "user:", user);
    const profile = await this.profileRepository.findOne({
      where: { region, user: { id: user.id } }
    });
    console.log("Profile found:", profile);
    return !!profile;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
