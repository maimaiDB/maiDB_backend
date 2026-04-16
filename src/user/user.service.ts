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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async createUser(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    // 이메일 중복 확인
    const existingUser = await this.userRepository.findOne({ where: { email: email } });
    if (existingUser) {
      throw EmailAlreadyExistsException();
    }

    /*
    // 이메일 유효성 검증 실패 처리
    if (!email || !this.isValidEmail(email)) {
      throw new BadRequestException({
        success: false,
        timestamp: new Date().toISOString(),
        error: {
          code: 'INVALID_INPUT',
          message: '유효하지 않은 이메일 형식입니다.',
          path: '/users',
        },
      });
    }
    */

    // 사용자 생성
    const newUser = this.userRepository.create({
      email,
      password,
    });
    const savedUser = await this.userRepository.save(newUser);

    return {
      success: true,
      data: {
        userId: savedUser.id,
        email: savedUser.email,
        createdAt: savedUser.createdAt,
      },
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async findAllUsers() {
    const users = await this.userRepository.find({});

    // UserAdminResponseDto로 변환하여 반환
    const responseData = plainToInstance(AdminUserResponseDto, users, {
      // Expose된 필드만 포함하도록 설정
      excludeExtraneousValues: true,
    })

    return responseData;
  }

  async findOneUser(id: number) {
    // id 파라미터 유효성 검증 실패 처리
    if (!id) {
      throw InvalidIdFormatException();
    }

    const user = await this.userRepository.findOne({ where: { id: id } });

    // 해당 ID의 유저가 존재하지 않을 때 처리
    if (!user) {
      throw UserNotFoundedException();
    }

    const responseData = plainToInstance(PublicUserResponseDto, user, {
      // Expose된 필드만 포함하도록 설정
      excludeExtraneousValues: true,
    });

    return responseData;
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
