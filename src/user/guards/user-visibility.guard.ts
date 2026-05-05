import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "../user.service";
import { AccessDeniedException } from "src/common/exception/service.exception";
import { UserRole } from "../enums/user-role.enum";

@Injectable()
export class UserVisibilityGuard implements CanActivate {
    constructor(private readonly userService: UserService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // null 가능
        const targetUserId = Number(request.params.id);

        const targetUser = await this.userService.findUserByIdOrFail(targetUserId);

        // 공개 계정이면 누구나 허용
        if (targetUser.isPublic) {
            return true;
        }

        // isPublic이 false인 경우, 본인 또는 관리자만 허용
        if (!user) {
            throw AccessDeniedException();
        }

        if (user.id === targetUserId || user.role === UserRole.ADMIN) {
            return true;
        }

        throw AccessDeniedException();
    }
}