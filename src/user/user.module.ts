import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // Auth의 Guard 및 Strategy를 사용하기 위해 모듈을 import해옴
    AuthModule
  ],
  controllers: [UserController],
  providers: [UserService],
  // UserService를 exports에 추가하여 다른 모듈에서 사용할 수 있도록 함
  exports: [UserService]
})
export class UserModule { }
