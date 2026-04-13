import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserAdminResponseDto } from './dto/user-admin-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async createUser(createUserDto: CreateUserDto) {
    const { userEmail, password } = createUserDto;

    // 이메일 중복 확인
    const existingUser = await this.userRepository.findOne({ where: { email: userEmail } });
    if (existingUser) {
      throw new ConflictException({
        success: false,
        timestamp: new Date().toISOString(),
        error: {
          code: 'EMAIL_ALREADY_EXISTS',
          message: '이미 사용 중인 이메일입니다.',
          path: '/users',
        },
      });
    }

    /*
    // 이메일 유효성 검증 실패 처리
    if (!userEmail || !this.isValidEmail(userEmail)) {
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
      email: userEmail,
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
    const responseData = plainToInstance(UserAdminResponseDto, users, {
      // Expose된 필드만 포함하도록 설정
      excludeExtraneousValues: true,
    })


    return responseData;
  }

  findOneUser(id: number) {
    return `This action returns a #${id} user`;
  }

  updateUser(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  removeUser(id: number) {
    return `This action removes a #${id} user`;
  }
}
