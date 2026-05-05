import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InvalidJwtFormatException, InvalidJwtTokenException, TokenExpiredException } from "src/common/exception/service.exception";

// JWT 토큰이 없는 경우에도 요청을 허용하는 AuthGuard
// JWT 토큰이 없는 경우 → user는 null로 세팅되어 컨트롤러에서 인증 여부를 쉽게 확인할 수 있도록 함
// strategy는 'jwt-access-token'으로 지정, access token 검증 로직을 재사용 함
@Injectable()
export class JwtOptionalAuthGuard extends AuthGuard('jwt-access-token') {
    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();

        const hasAccessToken = !!req.cookies?.accessToken;

        // 토큰이 아예 없는 경우 → 통과
        if (!hasAccessToken) {
            return null;
        }

        // 토큰은 있는데 검증 실패 → 차단
        if (err || !user) {
            // JWT 인증 실패 원인에 따라 예외를 던짐
            if (info?.name === 'TokenExpiredError') {
                // 토큰 만료됨
                throw TokenExpiredException();
            }
            if (info?.name === 'JsonWebTokenError') {
                if (info?.message === 'jwt malformed') {
                    // JWT 형식 오류
                    throw InvalidJwtFormatException();
                }
                if (info?.message === 'invalid signature') {
                    // JWT 서명 불일치 (JWT 위조 또는 secret 불일치) 
                    throw InvalidJwtTokenException();
                }
            }
            throw err || new UnauthorizedException('인증 실패');
        }

        // 정상 토큰 → user 세팅
        return user;
    }
}