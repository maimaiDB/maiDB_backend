import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Region } from './enums/region.enum';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { ProfileNotFoundedException } from 'src/common/exception/service.exception';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>
  ) { }

  create(createProfileDto: CreateProfileDto) {
    return 'This action adds a new profile';
  }

  async findProfileOrFail(region: Region, friendCode: string) {
    const profile = await this.profileRepository.findOne({ where: { region, friendCode } });

    if (!profile) {
      throw ProfileNotFoundedException();
    }

    return profile;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
