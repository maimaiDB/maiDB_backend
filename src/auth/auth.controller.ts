import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { Response } from 'express';

@Controller('auths')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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

    // 응답 쿠키에 access token 설정 (httpOnly로 설정하여 클라이언트에서 접근 불가능하게 함)
    res.setHeader('Authorization', 'Bearer ' + accessToken);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      // TODO [ ]: .env로 환경에 따라 secure 옵션을 true 혹은 false로 설정하여 HTTP 연결에서도 쿠키가 전송될 수 있도록 함 (개발 환경에서는 HTTPS를 사용하지 않을 수 있기 때문) 
      // secure: true,   // HTTPS 연결에서만 쿠키 전송
    });

    return {
      message: "로그인 성공!",
      timestamp: new Date().toISOString()
    };
  }

  @Post('/refresh')
  tokenRefresh(refreshAccessTokenDto: RefreshAccessTokenDto) {
    return this.authService.refreshAccessToken(refreshAccessTokenDto);
  }

  @Post('/logout')
  logout(lotougDto: LogoutDto) {
    return this.authService.logout(lotougDto);
  }
}
