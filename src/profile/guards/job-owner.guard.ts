import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
  AccessDeniedException,
  UserNotFoundedException,
} from 'src/common/exception/service.exception';
import { UserRole } from 'src/user/enums/user-role.enum';
import { ProfileService } from '../profile.service';

@Injectable()
export class JobOwnerGuard implements CanActivate {
  constructor(private readonly profileService: ProfileService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const { id } = request.params;
    const job = await this.profileService.getJobStatus(id);

    if (!job) {
      return true; // job not found는 컨트롤러에서 처리
    }

    // job의 userId가 요청을 보낸 사용자(user.id)와 일치하는지, 혹은 요청을 보낸 사용자가 ADMIN인지 확인하여 접근 허가
    if (job.data.user.id === user.id || user.role === UserRole.ADMIN) {
      return true;
    }

    throw AccessDeniedException();
  }
}
