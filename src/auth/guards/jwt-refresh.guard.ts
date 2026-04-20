import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

// Guard: HTTP 요청이 실제로 컨트롤러에 도달해도 되는지 결정하는 계층
// 즉, 요청을 허용할지 차단할지 판단!
// AuthGuard('jwt-refresh-token')는 Passport 전략(Strategy)을 사용하여 JWT refresh token의 유효성을 검사하는 Guard
// 'jwt-refresh-token'은 Passport 전략의 이름으로, 이 전략은 JWT refresh token을 검증하는 로직을 포함하고 있어야 함
// jwt-refresh-token Guard가 사용할 전략(Strategy)은 src/auth/strategies/jwt-refresh.strategy.ts 파일에 구현
@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') { }