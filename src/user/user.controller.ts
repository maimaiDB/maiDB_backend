import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { PublicUserResponseDto } from './dto/public-user-response.dto';
import { AdminUserResponseDto } from './dto/admin-user-response.dto';

/** 
 * CHECKLIST
 * [x] TODO: DB 연결
 * [ ] TODO: CRUD API 구현
 * [ ] TODO: 로그인 인증 구현
 * [x] TODO: 전달받는 데이터 유효성 검증 - class-validator를 사용하여 DTO 클래스에 유효성 검사 데코레이터 추가
 * [ ] TODO: response 및 에러 형식 통일 - API 응답 형식을 일관되게 유지하기 위해 공통 응답 구조 정의
 * [x] TODO: response할 데이터의 정리를 service가 아닌 controller에서 하도록 변경
 */

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const savedUser = await this.userService.createUser(createUserDto);

    return {
      success: true,
      data: {
        userId: savedUser.id,
        email: savedUser.email,
        createdAt: savedUser.createdAt,
      },
    };
  }

  @Get()
  async findAllUsers() {
    const users = await this.userService.findAllUsers();

    // UserAdminResponseDto로 변환하여 반환
    const responseData = plainToInstance(AdminUserResponseDto, users, {
      // Expose된 필드만 포함하도록 설정
      excludeExtraneousValues: true,
    })

    return responseData;
  }

  @Get(':id')
  async findOneUser(@Param('id') id: number) {
    const user = await this.userService.findUserById(id);

    const responseData = plainToInstance(PublicUserResponseDto, user, {
      // Expose된 필드만 포함하도록 설정
      excludeExtraneousValues: true,
    });

    return responseData;
  }

  @Patch(':id')
  updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userService.removeUser(+id);
  }
}
