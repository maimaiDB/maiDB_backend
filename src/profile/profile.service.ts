import { Injectable } from '@nestjs/common';
import { RawDataDto } from './dto/raw-data.dto';
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
    @InjectQueue('raw-data-normalization')
    private readonly queue: Queue,
  ) { }

  // 정규화 및 프로필 upsert를 수행하기 위한 메세지를 메세지큐에 등록하는 메소드
  async enqueueProfileSync(region: Region, friendCode: string, rawDataDto: RawDataDto) {
    const job = await this.queue.add(
      'raw-data-normalization',
      {
        region,
        friendCode,
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

  // raw 데이터에서 friend Code를 가져오는 메소드
  parseFriendCodeOrFail(html: string): string {
    const match = html.match(/(\d{13})/);

    if (this.isSessionExpired(html) || !match) {
      throw new Error('세션이 만료되었거나, friend code를 찾을 수 없습니다.');
    }

    return match[1];
  }

  isSessionExpired(html: string): boolean {
    return (
      html.includes('エラーコード：200002') ||
      html.includes('再度ログインしてください')
    );
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
