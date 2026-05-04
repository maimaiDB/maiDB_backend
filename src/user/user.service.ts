import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { AdminUserResponseDto } from './dto/admin-user-response.dto';
import { PublicUserResponseDto } from './dto/public-user-response.dto';
import {
  EmailAlreadyExistsException,
  InvalidIdFormatException,
  UserNotFoundedException,
} from 'src/common/exception/service.exception';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async createUser(email: string, password: string) {
    // NOTE : authService에서 비밀번호 해싱을 담당. 반드시 해싱을 끝낸 password가 이 메소드로 전달되어야 함!!!

    // 비밀번호 해싱
    const hashedPassword = await this.hashPassword(password);

    // 사용자 생성
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(newUser);

    return savedUser;
  }

  async hashPassword(password: string) {
    // bcrypt 라이브러리를 사용하여 비밀번호를 해싱, salt는 .env 파일에서 관리하여 보안 강화
    // salt rounds는 해싱의 복잡도를 결정하는 값으로, 일반적으로 10 이상을 권장
    return await bcrypt.hash(
      password + this.configService.get<string>('BCRYPT_SALT'),
      parseInt(this.configService.get<string>('BCRYPT_SALT_ROUNDS') || '10'),
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async isEmailTaken(email: string) {
    console.log('Checking email:', email);
    const user = await this.userRepository.findOne({ where: { email } });
    console.log('Found user:', user);
    return !!user;
  }

  async findAllUsers() {
    const users = await this.userRepository.find({});

    return users;
  }

  async findUserById(id: number) {
    // id 파라미터 유효성 검증 실패 처리
    if (!id) {
      throw InvalidIdFormatException();
    }

    const user = await this.userRepository.findOne({ where: { id: id } });

    // 해당 ID의 유저가 존재하지 않을 때 처리
    if (!user) {
      throw UserNotFoundedException();
    }

    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email: email } });

    return user;
  }

  async findUserByEmailIncludePassword(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password') // password 필드도 선택하여 조회
      .where('user.email = :email', { email })
      .getOne();

    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    // id 파라미터 유효성 검증 실패 처리
    if (!id) {
      throw InvalidIdFormatException();
    }

    // 변경하려는 이메일이 이미 존재하는 이메일인지 확인
    if (updateUserDto.email && (await this.isEmailTaken(updateUserDto.email))) {
      throw EmailAlreadyExistsException();
    }

    // 비밀번호 해싱 - updateUserDto에 password 필드가 존재할 때만 해싱 수행
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });

    // 해당 ID의 유저가 존재하지 않을 때 처리
    if (!user) {
      throw UserNotFoundedException();
    }

    const updatedUser = await this.userRepository.save(user);

    return updatedUser;
  }

  async removeUser(id: number) {
    // id 파라미터 유효성 검증 실패 처리
    if (!id) {
      throw InvalidIdFormatException();
    }

    // soft delete 수행 - deletedAt 컬럼에 삭제 시각이 기록되고 실제 데이터는 삭제되지 않음
    // soft delete를 취소하려면 await this.userRepository.restore(id);
    const responseData = await this.userRepository.softDelete(id);

    // 해당 ID의 유저가 존재하지 않을 때 처리
    if (responseData.affected === 0) {
      throw UserNotFoundedException();
    }

    return responseData;
  }
}
