import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { Response } from 'express';
import { InvalidJwtFormatException, TokenExpiredException, InvalidJwtTokenException } from 'src/common/exception/service.exception';

@Controller('auths')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  /**
   * CHECKLIST
   * [ ] TODO: 해당 유저의 만료되지 않은 refresh token이 존재하는 경우, 새로운 refresh token을 발급하기 전에 기존 refresh token을 만료시키거나 삭제하는 로직 구현 (refresh token의 유효성을 보장하기 위해) 
   */
  @Post('/login')
  @HttpCode(200) // 로그인 성공 시 200 OK 상태 코드 반환
  async login(
    @Body() loginDto: LoginDto,
    // 응답 객체를 주입받아 쿠키 설정에 사용
    // passthrough 옵션을 true로 설정하여 NestJS가 응답 객체를 완전히 제어하지 않고, 필요한 경우에만 직접 조작할 수 있도록 함
    // passthrough 옵션이 false인 경우 ,res.json() 또는 res.send()를 호출해야만 클라이언트가 응답을 받을 수 있음
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.authService.validateUser(loginDto);
    const accessToken = await this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

    // DB에 refresh token 저장
    await this.authService.setRefreshToken(user, refreshToken);

    // 응답 쿠키에 access token 및 refresh token 설정 (httpOnly로 설정하여 클라이언트에서 접근 불가능하게 함)
    res.setHeader('Authorization', 'Bearer ' + [accessToken, refreshToken]);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      // TODO [ ]: .env로 환경에 따라 secure 옵션을 true 혹은 false로 설정하여 HTTP 연결에서도 쿠키가 전송될 수 있도록 함 (개발 환경에서는 HTTPS를 사용하지 않을 수 있기 때문) 
      // secure: true,   // HTTPS 연결에서만 쿠키 전송
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      // secure: true,   // HTTPS 연결에서만 쿠키 전송
    });

    return {
      message: "로그인 성공!",
      timestamp: new Date().toISOString()
    };
  }

  @Post('/refresh')
  async refreshAccessToken(
    @Body() refreshAccessTokenDto: RefreshAccessTokenDto,
    @Res({ passthrough: true }) res: Response
  ) {
    // refreshAccessToken에서 verifyAsync 메소드를 사용하여 refresh token가 jwt 형식에 맞는지, 만료되지 않았는지를 검증함.
    // verifyAsync 메소드는 실패시 500 Internal Server Error를 발생시키기 때문에, 이를 처리하기 위해 try catch 사용
    // JWT 형식 오류의 경우 error.name = ' JsonWebTokenError', error.message = 'jwt malformed'
    // JWT 서명 불일치(JWT위조 혹은 secret 불일치)의 경우 error.name = ' JsonWebTokenError', error.message = 'invalid signature'
    // JWT 만료 오류의 경우 error.name = 'TokenExpiredError'
    try {
      const newAccessToken = await this.authService.refreshAccessToken(refreshAccessTokenDto);

      res.setHeader('Authorization', 'Bearer ' + newAccessToken);
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        // secure: true,   // HTTPS 연결에서만 쿠키 전송
      });

      return {
        message: "accessToken 재발급 성공!",
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // 토큰 만료됨
        // 만료된 refresh token DB에서 삭제
        // NOTE: 만약 refresh token이 오류로 인해 삭제되지 않은 경우에 대해 어떻게 대처할지 고민해볼 필요가 있음
        this.authService.removeRefreshToken(refreshAccessTokenDto.refreshToken);
        throw TokenExpiredException();
      }

      if (error.name === 'JsonWebTokenError') {
        if (error.message === 'jwt malformed') {
          // JWT 형식 오류
          throw InvalidJwtFormatException();
        } else if (error.message === 'invalid signature') {
          // JWT 서명 불일치 (JWT 위조 또는 secret 불일치) 
          throw InvalidJwtTokenException();
        }
      }

      // 그 외의 경우
      return error;
    }
  }

  @Post('/logout')
  logout(lotougDto: LogoutDto) {
    return this.authService.logout(lotougDto);
  }
}
