import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { UserRole } from 'src/user/enums/user-role.enum';
import { TagNameAlreadyExistsException } from 'src/common/exception/service.exception';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({ summary: '태그 생성 (관리자 전용)' })
  @ApiResponse({ status: 201, description: '태그 생성 성공' })
  @ApiResponse({ status: 401, description: 'Access 토큰이 없거나 만료됨' })
  @ApiResponse({ status: 403, description: '관리자 권한이 없음' })
  @ApiResponse({ status: 409, description: '태그명 중복' })
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createTag(@Body() createTagDto: CreateTagDto) {
    if (await this.tagService.isTagNameAlreadyExisted(createTagDto.tagName)) {
      throw TagNameAlreadyExistsException();
    }

    return this.tagService.createTag(createTagDto);
  }

  @Get()
  @ApiOperation({ summary: '전체 태그 조회 (관리자 전용)' })
  @ApiResponse({ status: 200, description: '전체 태그 조회 성공' })
  @ApiResponse({ status: 401, description: 'Access 토큰이 없거나 만료됨' })
  @ApiResponse({ status: 403, description: '관리자 권한이 없음' })
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getTags() {
    return this.tagService.getTags();
  }

  @Patch(':id')
  @ApiOperation({ summary: '태그 수정 (관리자 전용)' })
  @ApiResponse({ status: 200, description: '태그 수정 성공' })
  @ApiResponse({ status: 401, description: 'Access 토큰이 없거나 만료됨' })
  @ApiResponse({ status: 403, description: '관리자 권한이 없음' })
  @ApiResponse({ status: 404, description: '해당 id의 태그가 발견되지 않음' })
  @ApiResponse({ status: 409, description: '태그명 중복' })
  @ApiParam({
    name: 'id',
    description: '태그 ID',
    type: Number,
  })
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagService.updateTag(id, updateTagDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '태그 삭제 (관리자 전용)' })
  @ApiResponse({ status: 204, description: '태그 삭제 성공' })
  @ApiResponse({ status: 401, description: 'Access 토큰이 없거나 만료됨' })
  @ApiResponse({ status: 403, description: '관리자 권한이 없음' })
  @ApiResponse({ status: 404, description: '해당 id의 태그가 발견되지 않음' })
  @ApiParam({
    name: 'id',
    description: '태그 ID',
    type: Number,
  })
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.remove(id);
  }
}
