import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
  AccessDeniedException,
  UserNotFoundedException,
} from 'src/common/exception/service.exception';
import { UserRole } from 'src/user/enums/user-role.enum';
import { ProfileService } from '../profile.service';
import { Region } from '../enums/region.enum';

// friendCode, region을 토대로 관리자 및 자기 자신만 특정 리소스에 접근할 수 있도록 하는 가드
@Injectable()
export class ProfileOwnerGuard implements CanActivate {
  constructor(private readonly profileService: ProfileService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // JWT Guard를 통과한 이후에 사용되므로, request.user가 존재한다고 가정
    const user = request.user;

    const { friendCode, region } = request.params;

    // region의 형식이 잘못됐다면 에러
    if (!Object.values(Region).includes(region)) {
      throw AccessDeniedException(`Invalid region: ${region}`);
    }

    // friendCode와 region을 기반으로 profile 조회
    const profile = await this.profileService.findProfileOrFail(
      region,
      friendCode,
    );

    // profile의 userId가 요청을 보낸 사용자(user.id)와 일치하는지, 혹은 요청을 보낸 사용자가 ADMIN인지 확인하여 접근 허가
    if (profile.user === user.id || user.role === UserRole.ADMIN) {
      return true;
    }

    throw AccessDeniedException();
  }
}
