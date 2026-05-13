import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { JwtAccessGuard } from 'src/auth/guards/jwt-access.guard';
import { Roles } from 'src/user/decorators/roles.decorator';
import { RolesGuard } from 'src/user/guards/roles.guard';
import { UserRole } from 'src/user/enums/user-role.enum';
import { TagNameAlreadyExistsException } from 'src/common/exception/service.exception';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) { }

  @Post()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createTag(@Body() createTagDto: CreateTagDto) {
    if (await this.tagService.isTagNameAlreadyExisted(createTagDto.tagName)) {
      throw TagNameAlreadyExistsException();
    }

    return this.tagService.createTag(createTagDto);
  }

  @Get()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  getTags() {
    return this.tagService.getTags();
  }

  @Patch(':id')
  @Get()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto
  ) {
    return this.tagService.updateTag(id, updateTagDto);
  }

  @Delete(':id')
  @Get()
  @UseGuards(JwtAccessGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.remove(id);
  }
}
