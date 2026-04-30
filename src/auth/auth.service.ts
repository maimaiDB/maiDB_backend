import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { InvalidCredentialsException, RefreshTokenNotFoundedException } from 'src/common/exception/service.exception';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { get } from 'http';

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
    * [x] TODO: bcrypt를 사용해 password 및 jwt 해싱을 통한 암호화 구현 - bcrypt 사양 상 jwt는 compare가 제대로 적용 안될 확률이 높음(notion에 기록)
    * [ ] TODO: password와 관련된 정책 확실히 정의(어차피 암호화 됐으니 자유롭게 꺼낼것인가, 아님 암호화해도 지금처럼 한정적으로 꺼낼 수 있게 할것인가)
    * [x] TODO: refresh token 저장 및 관리 로직 구현 (DB에 저장, 만료된 토큰 삭제 등)
    * [x] TODO: Guard를 사용해 인증된 사용자만 접근할 수 있는 API 구현
   */
  async validateUser(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 이메일로 사용자 조회
    // User가 발견되지 않은 경우 findUserByEmailWithPassword에서 exception을 던지기 때문에 여기선 처리 안함
    const user = await this.userService.findUserByEmailWithPassword(email);

    if (!(await bcrypt.compare(password + this.configService.get<string>('BCRYPT_SALT'), user.password))) {
      throw InvalidCredentialsException("잘못된 비밀번호입니다.");
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

  async getRefreshTokenById(id: number) {
    const refreshToken = await this.refreshTokenRepository.findOne({ where: { id: id } });

    if (!refreshToken) {
      throw RefreshTokenNotFoundedException();
    }

    return refreshToken;
  }

  // 
  async isRefreshTokenStored(refreshToken: string) {
    const token = await this.refreshTokenRepository.findOne({ where: { token: refreshToken } });

    // !! -> 다른 타입의 데이터를 boolean 타입으로 형변환하기위해 문법
    // 즉, token이 존재하면 true, 아니면 false가 반환됨
    return !!token;
  }

  async removeRefreshToken(refreshToken: string) {
    await this.refreshTokenRepository.delete({ token: refreshToken });
  }
}
