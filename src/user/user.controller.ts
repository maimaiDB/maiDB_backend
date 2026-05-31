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
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

/**
 * CHECKLIST
 * [x] TODO: DB 연결
 * [x] TODO: CRUD API 구현
 * [x] TODO: 로그인 인증 구현
 * [x] TODO: 전달받는 데이터 유효성 검증 - class-validator를 사용하여 DTO 클래스에 유효성 검사 데코레이터 추가
 * [ ] TODO: response 및 에러 형식 통일 - API 응답 형식을 일관되게 유지하기 위해 공통 응답 구조 정의
 * [x] TODO: response할 데이터의 정리를 service가 아닌 controller에서 하도록 변경
 * [ ] TODO: delete시 PROFILE 및 CUSTOM_LIST, REFRESH_TOKEN까지 지워지게 해야함
 */

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @ApiOperation({ summary: '모든 사용자 정보 조회 (관리자 전용)' })
  @ApiResponse({ status: 200, description: '성공적으로 모든 사용자 정보를 조회' })
  @ApiResponse({ status: 401, description: '토큰이 없거나 만료됨' })
  @ApiResponse({ status: 403, description: '관리자 권한이 없음' })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getUsers() {
    const users = await this.userService.findAllUsers();

    // UserAdminResponseDto로 변환하여 반환
    const responseData = plainToInstance(AdminUserResponseDto, users, {
      // Expose된 필드만 포함하도록 설정
      excludeExtraneousValues: true,
    });

    return responseData;
  }

  @Get(':id')
  @ApiOperation({ summary: '특정 id의 사용자 정보 조회 (유저/관리자 전용)' })
  @ApiResponse({ status: 200, description: '성공적으로 사용자 정보를 조회' })
  @ApiResponse({ status: 400, description: '유효성 검증 실패' })
  @ApiResponse({ status: 401, description: '토큰이 없거나 만료됨' })
  @ApiResponse({ status: 403, description: '관리자 권한이 없거나 접근이 허용된 유저가 아님' })
  @ApiResponse({ status: 404, description: '해당 id의 유저가 발견되지 않음' })
  @ApiParam({
    name: 'id',
    description: '유저 ID',
    type: Number
  })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtOptionalAuthGuard, UserVisibilityGuard)
  async getUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findUserByIdOrFail(id);

    const responseData = plainToInstance(PublicUserResponseDto, user, {
      // Expose된 필드만 포함하도록 설정
      excludeExtraneousValues: true,
    });

    return responseData;
  }

  @Patch(':id')
  @ApiOperation({ summary: '특정 id의 사용자 정보 수정 (유저 본인/관리자 전용)' })
  @ApiResponse({ status: 200, description: '성공적으로 사용자 정보를 수정' })
  @ApiResponse({ status: 400, description: '유효성 검증 실패' })
  @ApiResponse({ status: 401, description: '토큰이 없거나 만료됨' })
  @ApiResponse({ status: 403, description: '관리자 권한이 없거나 유저 본인이 아님' })
  @ApiResponse({ status: 404, description: '해당 id의 유저가 발견되지 않음' })
  @ApiParam({
    name: 'id',
    description: '유저 ID',
    type: Number
  })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAccessGuard, RolesGuard, SelfGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '특정 id의 사용자 삭제(soft delete) (유저 본인/관리자 전용)' })
  @ApiResponse({ status: 204, description: '성공적으로 사용자가 삭제됨' })
  @ApiResponse({ status: 400, description: '유효성 검증 실패' })
  @ApiResponse({ status: 401, description: '토큰이 없거나 만료됨' })
  @ApiResponse({ status: 403, description: '관리자 권한이 없거나 유저 본인이 아님' })
  @ApiResponse({ status: 404, description: '해당 id의 유저가 발견되지 않음' })
  @ApiParam({
    name: 'id',
    description: '유저 ID',
    type: Number
  })
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAccessGuard, RolesGuard, SelfGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
