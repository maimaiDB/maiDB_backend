import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Region } from './enums/region.enum';
import { GetProfileParamDto } from './dto/get-profile-param.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('profiles')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    @InjectQueue('test-queue')
    private readonly queue: Queue,
  ) { }

  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get()
  async queueTest() {
    return await this.profileService.queueTest();
  }

  @Get(':region/:friendCode')
  async getProfile(@Param() params: GetProfileParamDto) {
    const { region, friendCode } = params;
    return this.profileService.findProfileOrFail(region, friendCode);
  }

  // @Get('job/:id')
  // async getJobStatus(@Param('id') id: string) {
  //   const job = await this.queue.getJob(id);

  //   if (!job) {
  //     return { status: 'not_found' };
  //   }

  //   return {
  //     state: await job.getState(),
  //     progress: job.progress,
  //     failedReason: job.failedReason,
  //   };
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}