import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
  AccessDeniedException,
  UserNotFoundedException,
} from 'src/common/exception/service.exception';
import { UserRole } from '../enums/user-role.enum';

// 관리자 및 자기 자신만 특정 리소스에 접근할 수 있도록 하는 가드
@Injectable()
export class SelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const user = request.user;
    const targetUserId = Number(request.params.id);

    if (!user) {
      throw UserNotFoundedException();
    }

    // 요청을 보낸 사용자(user)가 요청 대상 사용자(targetUserId)와 일치하지 않거나, 요청을 보낸 사용자가 ADMIN이 아닐 경우 접근 거부
    if (user.id !== targetUserId && user.role !== UserRole.ADMIN) {
      throw AccessDeniedException();
    }

    return true;
  }
}
