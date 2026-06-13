import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import {
  TagNameAlreadyExistsException,
  TagNotFoundedException,
} from 'src/common/exception/service.exception';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createTag(createTagDto: CreateTagDto) {
    const newTag = await this.tagRepository.create({ ...createTagDto });

    return await this.tagRepository.save(newTag);
  }

  async isTagNameAlreadyExisted(tagName: string) {
    const tag = await this.tagRepository.findOne({ where: { tagName } });

    return !!tag;
  }

  async findTagByTagNameOrFail(tagName: string) {
    const tag = await this.tagRepository.findOne({ where: { tagName } });

    if (!tag) {
      throw TagNotFoundedException();
    }

    return tag;
  }

  async getTags() {
    return await this.tagRepository.find({});
  }

  async updateTag(id: number, updateTagDto: UpdateTagDto) {
    if (
      updateTagDto.tagName &&
      (await this.isTagNameAlreadyExisted(updateTagDto.tagName))
    ) {
      throw TagNameAlreadyExistsException();
    }

    const tag = await this.tagRepository.preload({
      id: id,
      ...updateTagDto,
    });

    if (!tag) {
      throw TagNotFoundedException();
    }

    return await this.tagRepository.save(tag);
  }

  async remove(id: number) {
    const response = await this.tagRepository.delete(id);

    if (response.affected === 0) {
      throw TagNotFoundedException();
    }

    return response;
  }
}
