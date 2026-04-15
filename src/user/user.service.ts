import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { AdminUserResponseDto } from './dto/admin-user-response.dto';
import { PublicUserResponseDto } from './dto/public-user-response.dto';

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
      throw new ConflictException({
        success: false,
        timestamp: new Date().toISOString(),
        code: 'EMAIL_ALREADY_EXISTS',
        message: '이미 사용 중인 이메일입니다.',
      });
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
      throw new BadRequestException({
        timestamp: new Date().toISOString(),
        code: 'INVALID_INPUT',
        message: 'ID 파라미터가 유효하지 않습니다.',
      });
    }

    const user = await this.userRepository.findOne({ where: { id: id } });

    // 해당 ID의 유저가 존재하지 않을 때 처리
    if (!user) {
      throw new NotFoundException({
        timestamp: new Date().toISOString(),
        code: 'USER_NOT_FOUNDED',
        message: '해당 ID의 유저가 발견되지 않았습니다.',
      });
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
      throw new BadRequestException({
        timestamp: new Date().toISOString(),
        code: 'INVALID_INPUT',
        message: 'ID 파라미터가 유효하지 않습니다.',
      });
    }

    if (await this.userRepository.findOne({ where: { email: updateUserDto.email } })) {
      throw new ConflictException({
        timestamp: new Date().toISOString(),
        code: 'EMAIL_ALREADY_EXISTS',
        message: '이미 사용 중인 이메일입니다.',
      });
    }

    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });

    // 해당 ID의 유저가 존재하지 않을 때 처리
    if (!user) {
      throw new NotFoundException({
        timestamp: new Date().toISOString(),
        code: 'USER_NOT_FOUNDED',
        message: '해당 ID의 유저가 발견되지 않았습니다.',
      });
    }

    const updatedUser = await this.userRepository.save(user);

    return updatedUser;
  }

  async removeUser(id: number) {
    // id 파라미터 유효성 검증 실패 처리
    if (!id) {
      throw new BadRequestException({
        timestamp: new Date().toISOString(),
        code: 'INVALID_INPUT',
        message: 'ID 파라미터가 유효하지 않습니다.',
      });
    }

    // soft delete 수행 - deletedAt 컬럼에 삭제 시각이 기록되고 실제 데이터는 삭제되지 않음
    // soft delete를 취소하려면 await this.userRepository.restore(id);
    const responseData = await this.userRepository.softDelete(id);

    // 해당 ID의 유저가 존재하지 않을 때 처리
    if (responseData.affected === 0) {
      throw new NotFoundException({
        timestamp: new Date().toISOString(),
        code: 'USER_NOT_FOUNDED',
        message: '해당 ID의 유저가 발견되지 않았습니다.',
      });
    }

    return responseData;
  }
}
