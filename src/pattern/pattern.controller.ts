import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PatternService } from './pattern.service';
import { CreatePatternDto } from './dto/create-pattern.dto';
import { UpdatePatternDto } from './dto/update-pattern.dto';
import { SongService } from 'src/song/song.service';
import { SongNotFoundedException } from 'src/common/exception/service.exception';
import { JwtRefreshGuard } from 'src/auth/guards/jwt-refresh.guard';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from 'src/user/enums/user-role.enum';

@Controller('patterns')
export class PatternController {
  constructor(
    private readonly patternService: PatternService,
    private readonly songService: SongService
  ) { }

  @Post(':songId')
  @UseGuards(JwtRefreshGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createPattern(
    @Param('songId', ParseIntPipe) songId: number,
    @Body() patternData: CreatePatternDto,
  ) {
    // 먼저 songId의 노래가 존재하는지 확인
    const song = await this.songService.findSongById(songId);
    if (!song) {
      throw SongNotFoundedException();
    }

    const pattern = await this.patternService.createPattern(patternData, song);

    return pattern;
  }

  @Get()
  async getPatterns() {
    return await this.patternService.findPatterns();
  }

  @Get(':patternId')
  async getPattern(@Param('patternId', ParseIntPipe) id: number) {
    return await this.patternService.findPatternByIdOrFail(id);
  }

  @Patch(':patternId')
  @UseGuards(JwtRefreshGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updatePattern(@Param('patternId', ParseIntPipe) patternId: number, @Body() updatePatternDto: UpdatePatternDto) {
    return this.patternService.updatePattern(patternId, updatePatternDto);
  }

  @Delete(':patternId')
  @UseGuards(JwtRefreshGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async removePattern(@Param('patternId', ParseIntPipe) patternId: number) {
    return await this.patternService.removePattern(patternId);
  }
}
