import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessDeniedException } from 'src/common/exception/service.exception';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    // reflector : 핸들러에 설정된 메타데이터를 읽어오는 역할을 하는 NestJS의 유틸리티 클래스
    private readonly reflector: Reflector,
  ) {}

  // canActive : true가 반환되면 요청이 허용되고, false가 반환되면 요청이 거부됨
  // ExecutionContext는 현재 실행 중인 요청에 대한 정보를 담고 있는 객체로,
  // HTTP 요청, WebSocket 메시지, RPC 호출 등 다양한 유형의 요청에 대한 정보를 제공
  canActivate(context: ExecutionContext): boolean {
    // this.reflector를 통해 핸들러에 설정된 'roles' 메타데이터를 가져옴
    // 'roles' 메타데이터는 roles.decorator.ts에서 만든 커스텀 데코레이터 @Roles()로 등록
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // user의 role이 @Roles()로 등록한 메타데이터 안에 없을 경우 에러 출력
    if (!requiredRoles.includes(user.role)) {
      throw AccessDeniedException();
    }

    return true;
  }
}
