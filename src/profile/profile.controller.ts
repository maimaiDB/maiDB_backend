import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Region } from './enums/region.enum';
import { GetProfileParamDto } from './dto/get-profile-param.dto';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) { }

  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  @Get(':region/:friendCode')
  async getProfile(@Param() params: GetProfileParamDto) {
    const { region, friendCode } = params;
    return this.profileService.findProfileOrFail(region, friendCode);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}