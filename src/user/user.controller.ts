import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/** 
 * CHECKLIST
 * [x] TODO: DB 연결
 * [ ] TODO: CRUD API 구현
 * [ ] TODO: 로그인 인증 구현
 * [x] TODO: 전달받는 데이터 유효성 검증 - class-validator를 사용하여 DTO 클래스에 유효성 검사 데코레이터 추가
 * [ ] TODO: response 및 에러 형식 통일 - API 응답 형식을 일관되게 유지하기 위해 공통 응답 구조 정의
 */

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  findOneUser(@Param('id') id: number) {
    return this.userService.findOneUser(id);
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
