import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { RawDataDto } from './dto/raw-data.dto';
import { ProfileParamDto } from './dto/profile-param.dto';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { SyncProfileParamDto } from './dto/sync-profile-param.dto';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from 'src/user/enums/user-role.enum';
import { ProfileOwnerGuard } from './guards/profile-owner.guard';

@Controller('profiles')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
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

    const response = await this.profileService.enqueueProfileSync(region, friendCode, rawDataDto, req.user);


    return response;
  }

  @Get(':region/:friendCode')
  async getProfile(@Param() params: ProfileParamDto) {
    const { region, friendCode } = params;
    return this.profileService.findProfileOrFail(region, friendCode);
  }

  /**
   * CHECKLIST
   * [ ]TODO: profile을 지울 때 PLAY_RECORD 테이블까지 지워지게 해야함
   *  */

  @Delete(':region/:friendCode')
  @UseGuards(JwtAccessGuard, RolesGuard, ProfileOwnerGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async removeProfile(@Param() params: ProfileParamDto) {
    const { region, friendCode } = params;
    return await this.profileService.removeProfile(region, friendCode);
  }
}