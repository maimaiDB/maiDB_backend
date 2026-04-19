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
    * [ ] TODO: refresh token 저장 및 관리 로직 구현 (DB에 저장, 만료된 토큰 삭제 등)
    * [ ] TODO: Guard를 사용해 인증된 사용자만 접근할 수 있는 API 구현
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
    const payload = { email: user.email, userId: user.id, nickname: user.nickname };

    return await this.jwtService.signAsync(payload);
  }

  async generateRefreshToken(user: User) {
    const payload = { email: user.email, userId: user.id, nickname: user.nickname };

    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME') || '86400', 10),
    });
  }

  async setRefreshToken(user: User, refreshToken: string) {
    const newRefreshToken = await this.refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + parseInt(this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME') || '86400', 10) * 1000),
    });

    const savedRefreshToken = await this.refreshTokenRepository.save(newRefreshToken);

    return savedRefreshToken;
  }

  async refreshAccessToken(refreshAccessTokenDto: RefreshAccessTokenDto) {
    const { refreshToken } = refreshAccessTokenDto;

    const decodedRefreshToken = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET')
    });

    const userId = decodedRefreshToken.userId;
    const user = await this.userService.findUserById(userId);
    // User가 발견되지 않은 경우 findUserById에서 exception을 던지기 때문에 여기선 처리 안함

    const newAccessToken = await this.generateAccessToken(user);

    return newAccessToken;
  }

  async removeRefreshToken(refreshToken: string) {
    await this.refreshTokenRepository.delete({ token: refreshToken });
  }

  logout(lotougDto: LogoutDto) {
    return `logout method`;
  }
}
