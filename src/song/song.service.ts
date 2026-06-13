import { Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { Repository } from 'typeorm';
import { SongNotFoundedException, SongTitleAlreadyExistsException } from 'src/common/exception/service.exception';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
  ) { }

  async createSong(createSongDto: CreateSongDto) {
    const newSong = await this.songRepository.create({ ...createSongDto });

    return await this.songRepository.save(newSong);
  }

  async isTitleAlreadyExisted(title: string) {
    const song = await this.songRepository.findOne({ where: { title } });

    return !!song;
  }

  async findSongByTitleOrFail(title: string) {
    const song = await this.songRepository.findOne({ where: { title } });

    if (!song) {
      throw SongNotFoundedException();
    }

    return song;
  }

  async getSongs() {
    return await this.songRepository.find({});;
  }

  async updateSong(id: number, updateSongDto: UpdateSongDto) {

    if (updateSongDto.title && await this.isTitleAlreadyExisted(updateSongDto.title)) {
      throw SongTitleAlreadyExistsException();
    }

    const song = await this.songRepository.preload({
      id: id,
      ...updateSongDto,
    });

    if (!song) {
      throw SongNotFoundedException();
    }

    return await this.songRepository.save(song);
  }

  async remove(id: number) {
    return await this.songRepository.delete(id);
  }
}
