import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { LogoutDto } from './dto/logout.dto';

@Controller('auths')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
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
