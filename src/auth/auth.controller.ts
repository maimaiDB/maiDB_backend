import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpCode, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { InvalidJwtFormatException, TokenExpiredException, InvalidJwtTokenException } from 'src/common/exception/service.exception';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

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

  // [x] TODO: jwt-refresh guard를 사용하도록 변경. 이 guard는 refresh token의 유효성을 검사하여 인증된 사용자만 access token을 재발급받을 수 있도록 함
  @Post('/refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshAccessToken(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response
  ) {
    console.log(req.user);
    const newAccessToken = await this.authService.refreshAccessToken(req.cookies.refreshToken);

    res.setHeader('Authorization', 'Bearer ' + newAccessToken);
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      // secure: true,   // HTTPS 연결에서만 쿠키 전송
    });

    return {
      message: "accessToken 재발급 성공!",
      timestamp: new Date().toISOString()
    }
  }

  @Post('/logout')
  // 로그아웃 시 refresh token의 유효성을 검사하여 인증된 사용자만 로그아웃할 수 있도록 함
  @UseGuards(JwtRefreshGuard)
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    // console.log(req.cookies);
    await this.authService.removeRefreshToken(req.cookies.refreshToken);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return {
      message: "로그아웃 성공!",
      timestamp: new Date().toISOString()
    };
  }
}
