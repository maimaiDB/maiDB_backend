import { Injectable } from '@nestjs/common';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './entities/song.entity';
import { Repository } from 'typeorm';

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

  async findSongByTitle(title: string) {
    return await this.songRepository.findOne({ where: { title } });
  }

  findAll() {
    return `This action returns all song`;
  }

  findOne(id: number) {
    return `This action returns a #${id} song`;
  }

  update(id: number, updateSongDto: UpdateSongDto) {
    return `This action updates a #${id} song`;
  }

  remove(id: number) {
    return `This action removes a #${id} song`;
  }
}
