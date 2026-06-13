import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { RawDataDto } from './dto/raw-data.dto';
import { ProfileParamDto } from './dto/profile-param.dto';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { SyncProfileParamDto } from './dto/sync-profile-param.dto';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from 'src/user/enums/user-role.enum';
import { ProfileOwnerGuard } from './guards/profile-owner.guard';
import { JobOwnerGuard } from './guards/job-owner.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // 프로필 동기화
  //
  @Post(':region')
  @ApiOperation({ summary: 'raw데이터 정규화 메세지 등록 (유저/관리자 전용)' })
  @ApiResponse({ status: 202, description: 'MQ에 정규화 메세지 삽입 성공' })
  @ApiResponse({ status: 400, description: '유효성 검증 실패' })
  @ApiResponse({ status: 401, description: 'Access 토큰이 없거나 만료됨' })
  @ApiParam({
    name: 'region',
    description: '내수/외수 구분',
    type: String,
  })
  @ApiBearerAuth('accessToken')
  @HttpCode(202) // Profile 존재 여부와 관계없이 MQ에 정규화 메세지가 들어가니까 응답은 202 Accepted로 통일
  @UseGuards(JwtAccessGuard)
  async syncProfile(
    @Param() params: SyncProfileParamDto,
    @Body() rawDataDto: RawDataDto,
    @Req() req: any,
  ) {
    const { region } = params;

    const start = performance.now();
    const friendCode = this.profileService.parseFriendCodeOrFail(
      rawDataDto.userFriendCode.html || '',
    );
    const end = performance.now();
    console.log(`실행 시간: ${end - start} ms`);

    const response = await this.profileService.enqueueProfileSync(
      region,
      friendCode,
      rawDataDto,
      req.user,
    );

    return response;
  }

  @Get('job/:id')
  @ApiOperation({
    summary:
      '삽입한 정규화 메세지(job)의 상태를 가져오는 메소드 (유저/관리자 전용)',
  })
  @ApiResponse({ status: 200, description: 'job 상태 가져오기 성공' })
  @ApiResponse({ status: 400, description: '유효성 검증 실패' })
  @ApiResponse({ status: 401, description: 'Access 토큰이 없거나 만료됨' })
  @ApiResponse({
    status: 403,
    description: '관리자 권한이 없거나 job을 등록한 유저 본인이 아님',
  })
  @ApiResponse({ status: 404, description: '해당 id의 job이 발견되지 않음' })
  @ApiParam({
    name: 'region',
    description: '내수/외수 구분',
    type: String,
  })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAccessGuard, JobOwnerGuard)
  async getJobStatus(@Param('id') id: string) {
    const job = await this.profileService.getJobStatus(id);

    if (!job) {
      return { status: 'not_found' };
    }

    return {
      state: await job.getState(),
      progress: job.progress,
      failedReason: job.failedReason,
    };
  }

  @Get(':region/:friendCode')
  @ApiOperation({
    summary: '특정 region/friendCode의 프로필 조회 (유저/관리자 전용)',
  })
  @ApiResponse({ status: 200, description: '프로필 조회 성공' })
  @ApiResponse({ status: 400, description: '유효성 검증 실패' })
  @ApiResponse({ status: 401, description: 'Access 토큰이 없거나 만료됨' })
  @ApiResponse({
    status: 403,
    description: '관리자 권한이 없거나 유저 본인이 아님',
  })
  @ApiResponse({
    status: 404,
    description: '해당 region/friendCode의 프로필이 발견되지 않음',
  })
  @ApiParam({
    name: 'region',
    description: '내수/외수 구분',
    type: String,
  })
  @ApiParam({
    name: 'friendCode',
    description: '친구 코드(숫자 13자리)',
    type: String,
  })
  async getProfile(@Param() params: ProfileParamDto) {
    const { region, friendCode } = params;
    return this.profileService.findProfileOrFail(region, friendCode);
  }

  /**
   * CHECKLIST
   * [ ]TODO: profile을 지울 때 PLAY_RECORD 테이블까지 지워지게 해야함
   *  */

  @Delete(':region/:friendCode')
  @ApiOperation({ summary: '프로필을 지우는 메소드 (유저/관리자 전용)' })
  @ApiResponse({ status: 204, description: '프로필 삭제 성공' })
  @ApiResponse({ status: 400, description: '유효성 검증 실패' })
  @ApiResponse({ status: 401, description: 'Access 토큰이 없거나 만료됨' })
  @ApiResponse({
    status: 403,
    description: '관리자 권한이 없거나 유저 본인이 아님',
  })
  @ApiResponse({
    status: 404,
    description: '해당 region/friendCode의 프로필이 발견되지 않음',
  })
  @ApiParam({
    name: 'region',
    description: '내수/외수 구분',
    type: String,
  })
  @ApiParam({
    name: 'friendCode',
    description: '친구 코드(숫자 13자리)',
    type: String,
  })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAccessGuard, RolesGuard, ProfileOwnerGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async removeProfile(@Param() params: ProfileParamDto) {
    const { region, friendCode } = params;
    return await this.profileService.removeProfile(region, friendCode);
  }
}
