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
import { SongService } from './song.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from 'src/user/enums/user-role.enum';
import { SongTitleAlreadyExistsException } from 'src/common/exception/service.exception';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post()
  @ApiOperation({ summary: '노래 생성 (관리자 전용)' })
  @ApiResponse({ status: 201, description: '노래 생성 성공' })
  @ApiResponse({ status: 401, description: 'Access 토큰이 없거나 만료됨' })
  @ApiResponse({ status: 403, description: '관리자 권한이 없음' })
  @ApiResponse({ status: 409, description: '노래명 중복' })
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createSong(@Body() createSongDto: CreateSongDto) {
    const title = createSongDto.title;

    if (await this.songService.isTitleAlreadyExisted(title)) {
      throw SongTitleAlreadyExistsException();
    }

    return await this.songService.createSong(createSongDto);
  }

  @Get()
  @ApiOperation({ summary: '전체 노래 조회 (관리자 전용)' })
  @ApiResponse({ status: 200, description: '전체 노래 조회 성공' })
  @ApiResponse({ status: 401, description: 'Access 토큰이 없거나 만료됨' })
  @ApiResponse({ status: 403, description: '관리자 권한이 없음' })
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getSongs() {
    return await this.songService.getSongs();
  }

  @Patch(':id')
  @ApiOperation({ summary: '노래 수정 (관리자 전용)' })
  @ApiResponse({ status: 200, description: '노래 수정 성공' })
  @ApiResponse({ status: 401, description: 'Access 토큰이 없거나 만료됨' })
  @ApiResponse({ status: 403, description: '관리자 권한이 없음' })
  @ApiResponse({ status: 404, description: '해당 id의 노래가 발견되지 않음' })
  @ApiResponse({ status: 409, description: '노래명 중복' })
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateSong(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDto: UpdateSongDto,
  ) {
    return this.songService.updateSong(id, updateSongDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '노래 삭제 (관리자 전용)' })
  @ApiResponse({ status: 204, description: '노래 삭제 성공' })
  @ApiResponse({ status: 401, description: 'Access 토큰이 없거나 만료됨' })
  @ApiResponse({ status: 403, description: '관리자 권한이 없음' })
  @ApiResponse({ status: 404, description: '해당 id의 노래가 발견되지 않음' })
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.songService.remove(id);
  }
}
