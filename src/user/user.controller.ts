import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { PublicUserResponseDto } from './dto/public-user-response.dto';
import { AdminUserResponseDto } from './dto/admin-user-response.dto';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from './enums/user-role.enum';
import { SelfGuard } from './guards/self.guard';
import { JwtOptionalAuthGuard } from 'src/auth/guards/jwt-optional-auth.guard';
import { UserVisibilityGuard } from './guards/user-visibility.guard';

/**
 * CHECKLIST
 * [x] TODO: DB 연결
 * [x] TODO: CRUD API 구현
 * [x] TODO: 로그인 인증 구현
 * [x] TODO: 전달받는 데이터 유효성 검증 - class-validator를 사용하여 DTO 클래스에 유효성 검사 데코레이터 추가
 * [ ] TODO: response 및 에러 형식 통일 - API 응답 형식을 일관되게 유지하기 위해 공통 응답 구조 정의
 * [x] TODO: response할 데이터의 정리를 service가 아닌 controller에서 하도록 변경
 */

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAllUsers() {
    const users = await this.userService.findAllUsers();

    // UserAdminResponseDto로 변환하여 반환
    const responseData = plainToInstance(AdminUserResponseDto, users, {
      // Expose된 필드만 포함하도록 설정
      excludeExtraneousValues: true,
    });

    return responseData;
  }

  @Get(':id')
  @UseGuards(JwtOptionalAuthGuard, UserVisibilityGuard)
  async findOneUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findUserByIdOrFail(id);

    const responseData = plainToInstance(PublicUserResponseDto, user, {
      // Expose된 필드만 포함하도록 설정
      excludeExtraneousValues: true,
    });

    return responseData;
  }

  @Patch(':id')
  @UseGuards(JwtAccessGuard, RolesGuard, SelfGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard, RolesGuard, SelfGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.removeUser(id);
  }
}
