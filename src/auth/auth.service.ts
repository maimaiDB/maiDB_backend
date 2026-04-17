import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { InvalidCredentialsException } from 'src/common/exception/service.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) { }

  async validateUser(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 이메일로 사용자 조회
    // User가 발견되지 않은 경우 findUserByEmailWithPassword에서 exception을 던지기 때문에 여기선 처리 안함
    const user = await this.userService.findUserByEmailWithPassword(email);

    if (password != user.password) {
      throw InvalidCredentialsException();
    }

    return user;
  }

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
