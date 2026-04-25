import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmModuleOptions } from './configs/typeorm.config';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `src/configs/env/.development.env`, // 환경 변수 파일 경로 설정
      isGlobal: true, // ConfigModule을 전역 모듈로 설정하여 어디서든 환경 변수에 접근할 수 있도록 함
    }),
    TypeOrmModule.forRoot(typeOrmModuleOptions),
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
