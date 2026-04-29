import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { UserService } from "src/user/user.service";
import { TokenExpiredError } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';
import { AuthService } from "../auth.service";

// jwt-refresh.guard.ts에서 JwtRefreshGuard가 사용할 전략(Strategy)인 'jwt-refresh-token'을 구현하는 클래스
// JwtRefreshGuard가 실행된 후, JwtRefreshGuard의 AuthGuard('jwt-refresh-token')가 PassportStrategy(Strategy, 'jwt-refresh-token')로 지정된 JwtRefreshStrategy를 찾음
// 이후, validate 메소드를 호출하여 JWT refresh token의 유효성을 검사함
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {
        const config = {
            // Authorization 헤더에서 Bearer 토큰을 추출하는 기본 방법 대신, 쿠키에서 refresh token을 추출하도록 커스텀 extractor 사용
            // 이 과정에서 passport-jwt 라이브러리가 내부적으로 jwt 토큰을 파싱하고, 토큰의 payload를 validate 메소드로 전달함
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    // console.log(request?.cookies?.refreshToken);
                    // password-jwt로 쿠키 안의 refreshToken이 jwt인지를 검증
                    return request?.cookies?.refreshToken; // 쿠키에서 refreshToken 추출
                },
            ]),
            secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
            // true로 하면 validate 메소드에서 req 객체에 접근할 수 있음
            passReqToCallback: true,
        };
        super(config);
    }

    // [ ] TODO: 해당 refresh 토큰이 DB에 존재하는지 validate, 만료되진 않았는지 확인하는 로직 작성
    // password-jwt가 검증한 JWT payload를 받아 추가적인 사용자 인증 로직 수행
    async validate(req: Request, payload) {
        // console.log(payload);
        const refreshToken = req.cookies['refreshToken'];
        
        // DB에 저장된 refresh token을 가져옴
        const hashedToken = await this.authService.getRefreshTokenById(payload.id)

        // DB에 저장된 refresh token과 클라이언트에서 전달된 refresh token이 일치하는지 확인
        if(!await bcrypt.compare(refreshToken + this.configService.get<string>('BCRYPT_SALT'), hashedToken.token)) {
            throw new UnauthorizedException("유효하지 않은 refresh token입니다.");
        }
        
        const user = await this.userService.findUserById(
            payload.userId
        );
        // validate에서 반환된 값은 controller에서 @Req()를 통해 접근 가능
        // 단, 반드시 "req.user"(user가 중요!!!)로만 접근 가능함
        // 즉, 가능하다면 유저와 관련된 최소한의 정보(사용자 ID나 이메일, 권한, 역할 등)만 return하는게 좋음
        return user;
    }
}