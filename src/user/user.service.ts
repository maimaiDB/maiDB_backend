import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { AdminUserResponseDto } from './dto/admin-user-response.dto';
import { PublicUserResponseDto } from './dto/public-user-response.dto';
import { EmailAlreadyExistsException, InvalidIdFormatException, UserNotFoundedException } from 'src/common/exception/service.exception';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) { }

  async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    // bcrypt 라이블러리를 사용하여 비밀번호를 해싱, salt는 .env 파일에서 관리하여 보안 강화
    // salt rounds는 해싱의 복잡도를 결정하는 값으로, 일반적으로 10 이상을 권장
    const hashedPassword = await bcrypt.hash(password + this.configService.get<string>('BCRYPT_SALT'), parseInt(this.configService.get<string>('BCRYPT_SALT_ROUNDS') || '10'));
    // console.log(hashedPassword);
    // console.log(password + this.configService.get<string>('BCRYPT_SALT'));
    // console.log(await bcrypt.compare('1234' + this.configService.get<string>('BCRYPT_SALT'), hashedPassword));

    // 이메일 중복 확인
    const existingUser = await this.userRepository.findOne({ where: { email: email } });
    if (existingUser) {
      throw EmailAlreadyExistsException();
    }

    // 사용자 생성
    const newUser = this.userRepository.create({
      email,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(newUser);

    return savedUser;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

  async findUserByEmailWithPassword(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password') // password 필드도 선택하여 조회
      .where('user.email = :email', { email })
      .getOne();

    // 해당 이메일의 유저가 존재하지 않을 때 처리
    if (!user) {
      throw UserNotFoundedException();
    }

    return user;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    // id 파라미터 유효성 검증 실패 처리
    if (!id) {
      throw InvalidIdFormatException();
    }

    if (await this.userRepository.findOne({ where: { email: updateUserDto.email } })) {
      throw EmailAlreadyExistsException();
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
