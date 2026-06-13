import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    // JWT 설정을 ConfigService를 통해 동적으로 가져올 수 있도록 JwtModule을 registerAsync로 설정
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: parseInt(configService.get<string>('JWT_ACCESS_EXPIRATION_TIME') || '3600', 10),
        },
      }),
      // ConfigService를 주입하여 JWT 설정을 동적으로 가져올 수 있도록 함
      inject: [ConfigService],
    }),
    // AuthService와 UserModule 간의 순환 의존성 해결을 위해 forwardRef 사용  
    forwardRef(() => UserModule),
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService,
    // guard가 사용하는 Strategy들을 주입
    JwtRefreshStrategy,
    JwtAccessStrategy,
  ],
})
export class AuthModule { }
