import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { RawDataDto } from './dto/raw-data.dto';
import { GetProfileParamDto } from './dto/get-profile-param.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { SyncProfileParamDto } from './dto/sync-profile-param.dto';

@Controller('profiles')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    @InjectQueue('raw-data-normalization')
    private readonly queue: Queue,
  ) { }

  // 프로필 동기화
  // 
  @Post(':region')
  @HttpCode(202) // Profile 존재 여부와 관계없이 MQ에 정규화 메세지가 들어가니까 응답은 202 Accepted로 통일
  @UseGuards(JwtAccessGuard)
  async syncProfile(
    @Param() params: SyncProfileParamDto,
    @Body() rawDataDto: RawDataDto,
    @Req() req: any,
  ) {
    const { region } = params;

    const start = performance.now();
    const friendCode = this.profileService.parseFriendCodeOrFail(rawDataDto.userFriendCode.html || '');
    const end = performance.now();
    console.log(`실행 시간: ${end - start} ms`);

    const response = await this.profileService.enqueueProfileSync(region, friendCode, rawDataDto);


    return response;
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}