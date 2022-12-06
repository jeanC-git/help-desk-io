import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { handleDBExceptions } from 'src/common/helpers';
import { Repository } from 'typeorm';
import { CreateTaxonomyDto } from './dto/create-taxonomy.dto';
import { UpdateTaxonomyDto } from './dto/update-taxonomy.dto';
import { Taxonomy } from './entities/taxonomy.entity';

@Injectable()
export class TaxonomiesService {

  constructor(
    @InjectRepository(Taxonomy)
    private readonly taxonomyRepository: Repository<Taxonomy>,
  ) { }


  async create(createTaxonomyDto: CreateTaxonomyDto) {
    const taxonomy = this.taxonomyRepository.create(createTaxonomyDto);

    await this.taxonomyRepository.save(taxonomy);
  }

  findAll() {
    return `This action returns all taxonomies`;
  }

  async findOne(group: string, type: string, code: string, resource = 'Record') {
    const taxonomy = await this.taxonomyRepository.findOneBy({ group, type, code })

    if (!taxonomy) throw new NotFoundException(`${resource} with code: '${code}' not found.`);

    return taxonomy;
  }

  update(id: number, updateTaxonomyDto: UpdateTaxonomyDto) {
    return `This action updates a #${id} taxonomy`;
  }

  remove(id: number) {
    return `This action removes a #${id} taxonomy`;
  }


  async deleteAllTaxonomies() {

    const query = this.taxonomyRepository.createQueryBuilder('taxonomies');

    try {
      return await query
        .delete()
        .where({})
        .execute();

    } catch (error) {
      handleDBExceptions(error);
    }
  }
}
