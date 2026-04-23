import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InvalidJwtFormatException, InvalidJwtTokenException, TokenExpiredException } from "src/common/exception/service.exception";
import { AuthService } from "../auth.service";


// Guard: HTTP 요청이 실제로 컨트롤러에 도달해도 되는지 결정하는 계층
// 즉, 요청을 허용할지 차단할지 판단!
// AuthGuard('jwt-refresh-token')는 Passport 전략(Strategy)을 사용하여 JWT refresh token의 유효성을 검사하는 Guard
// 'jwt-refresh-token'은 Passport 전략의 이름으로, 이 전략은 JWT refresh token을 검증하는 로직을 포함하고 있어야 함
// jwt-refresh-token Guard가 사용할 전략(Strategy)은 src/auth/strategies/jwt-refresh.strategy.ts 파일에 구현
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
    constructor(
        private readonly authService: AuthService,
    ) {
        super({});
    }
    // AuthGuard의 handleRequest 메소드를 오버라이드하여 JWT 인증 실패 시 발생한 예외를 커스터마이징
    handleRequest(err, user, info, context) {
        if (err || !user) {
            // JWT 인증 실패 원인에 따라 예외를 던짐
            if (info?.name === 'TokenExpiredError') {
                // 토큰 만료됨
                // 만료된 refresh token DB에서 삭제
                // NOTE: 만약 refresh token이 오류로 인해 삭제되지 않은 경우에 대해 어떻게 대처할지 고민해볼 필요가 있음

                // 토큰을 삭제하기 위해 요청 객체에서 refreshToken 값을 가져옴
                const req = context.switchToHttp().getRequest();
                const refreshToken = req?.cookies?.refreshToken;

                // handleRequest는 동기적으로 호출되는 함수라 async/await를 사용하지 못함
                // 그렇기에, 비동기 작업인 removeRefreshToken을 동기적으로 처리할 필요가 있고, 그 때문에 Promise를 명시적으로 처리함
                this.authService.removeRefreshToken(refreshToken).catch((error) => {
                    console.error('Failed to remove refresh token:', error);
                });
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