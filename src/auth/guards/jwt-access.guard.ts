import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InvalidJwtFormatException, InvalidJwtTokenException, TokenExpiredException } from "src/common/exception/service.exception";


// Guard: HTTP 요청이 실제로 컨트롤러에 도달해도 되는지 결정하는 계층
// 즉, 요청을 허용할지 차단할지 판단!
@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access-token') {
    constructor() {
        super({});
    }
    // AuthGuard의 handleRequest 메소드를 오버라이드하여 JWT 인증 실패 시 발생한 예외를 커스터마이징
    handleRequest(err, user, info, context) {
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
        return user;
    }
}