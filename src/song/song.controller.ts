import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SongService } from './song.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from 'src/user/enums/user-role.enum';
import { InvalidIdFormatException, SongTitleAlreadyExistsException } from 'src/common/exception/service.exception';

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) { }

  @Post()
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
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getSongs() {
    return await this.songService.getSongs();
  }

  @Patch(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateSong(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSongDto: UpdateSongDto
  ) {
    return this.songService.updateSong(id, updateSongDto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.songService.remove(id);
  }
}
