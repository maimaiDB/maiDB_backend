import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { UserService } from "src/user/user.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access-token') {
    constructor(
        private readonly userService: UserService,
        private readonly configService: ConfigService,
    ) {
        const config = {
            // Authorization 헤더에서 Bearer 토큰을 추출하는 기본 방법 대신, 쿠키에서 access token을 추출하도록 커스텀 extractor 사용
            // 이 과정에서 passport-jwt 라이브러리가 내부적으로 jwt 토큰을 파싱하고, 토큰의 payload를 validate 메소드로 전달함
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    return request?.cookies?.accessToken; // 쿠키에서 accessToken 추출
                },
            ]),
            secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
            // true로 하면 validate 메소드에서 req 객체에 접근할 수 있음
            passReqToCallback: true,
        };
        super(config);
    }

    async validate(req: Request, payload) {

        const user = await this.userService.findUserByIdOrFail(
            payload.userId
        );
        // validate에서 반환된 값은 controller에서 @Req()를 통해 접근 가능
        // 단, 반드시 "req.user"(user가 중요!!!)로만 접근 가능함
        // 즉, 가능하다면 유저와 관련된 최소한의 정보(사용자 ID나 이메일, 권한, 역할 등)만 return하는게 좋음
        return user;
    }
}