import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { LogoutDto } from './dto/logout.dto';

@Injectable()
export class AuthService {
  login(loginDto: LoginDto) {
    return 'This action adds a new auth';
  }

  refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
    return `refresh access token method`;
  }

  logout(lotougDto: LogoutDto) {
    return `logout method`;
  }
}
