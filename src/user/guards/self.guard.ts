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

    // 역할상 JWT Guard를 통과한 이후에 사용되기 때문에, request.user로 사용자 정보에 접근 가능하다고 가정
    const user = request.user;
    const targetUserId = Number(request.params.id);

    // 만약 JWT Guard를 통과하지 않는 등의 이유로 request.user가 존재하지 않을 경우 예외 처리
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
