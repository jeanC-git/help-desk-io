import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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


  create(createTaxonomyDto: CreateTaxonomyDto) {
    return 'This action adds a new taxonomy';
  }

  findAll() {
    return `This action returns all taxonomies`;
  }

  async findOneByCode(code: string, resource: string) {
    const taxonomy = await this.taxonomyRepository.findOneBy({ code })

    if (!taxonomy) throw new NotFoundException(`${resource} with Code: ${code} not found.`);

    return taxonomy;
  }

  update(id: number, updateTaxonomyDto: UpdateTaxonomyDto) {
    return `This action updates a #${id} taxonomy`;
  }

  remove(id: number) {
    return `This action removes a #${id} taxonomy`;
  }
}
