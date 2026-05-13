import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { TagNotFoundedException } from 'src/common/exception/service.exception';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) { }

  async createTag(createTagDto: CreateTagDto) {
    const newTag = await this.tagRepository.create({ ...createTagDto });

    return await this.tagRepository.save(newTag);
  }

  async isTagNameAlreadyExisted(tagName: string) {
    const tag = await this.tagRepository.findOne({ where: { tagName } });

    return !!tag;
  }

  async findTagByTagNameOrFail(tagName: string) {
    const tag = await this.tagRepository.findOne({ where: { tagName } });;

    if (!tag) {
      throw TagNotFoundedException();
    }

    return tag;
  }

  async getTags() {
    return await this.tagRepository.find({});
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
