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
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) { }

  /** 
   *  CHECKLIST
    * [x] TODO: generateAccessToken 및 generateRefreshToken 메소드 작성
    * [ ] TODO: bcrypt를 사용해 password 및 jwt 해싱을 통한 암호화 구현
    * [ ] TODO: password와 관련된 정책 확실히 정의(어차피 암호화 됐으니 자유롭게 꺼낼것인가, 아님 암호화해도 지금처럼 한정적으로 꺼낼 수 있게 할것인가)
   */
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

  async generateAccessToken(user: User) {
    const payload = { email: user.email, id: user.id, nickname: user.nickname };

    return await this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(user: User) {
    const payload = { email: user.email, id: user.id, nickname: user.nickname };

    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME') || '86400', 10),
    });
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
