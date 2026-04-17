import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { LogoutDto } from './dto/logout.dto';

@Injectable()
export class AuthService {
  login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const payload = { email, password };
    const accessToken = this.jwtService.sign(payload);
    console.log(accessToken);

    return 'This action adds a new auth';
  }

  refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
    return `refresh access token method`;
  }

  logout(lotougDto: LogoutDto) {
    return `logout method`;
  }
}
