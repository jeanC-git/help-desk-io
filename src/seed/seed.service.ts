import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductsService } from './../products/products.service';

import { initialData } from './data/seed-data';

import { User } from 'src/auth/entities/user.entity';
import { TaxonomiesService } from 'src/taxonomies/taxonomies.service';

@Injectable()
export class SeedService {


  constructor(
    private readonly productsService: ProductsService,

    private readonly taxonomiesService: TaxonomiesService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }


  async runSeed() {

    await this.deleteTables();

    await this.insertUsers();

    await this.insertTaxonomies();

    return 'Seed executed.';
  }

  private async deleteTables() {

    await this.productsService.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder
      .delete()
      .where({})
      .execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user));
    });

    await this.userRepository.save(users);
  }

  private async insertTaxonomies() {

    await this.taxonomiesService.deleteAllTaxonomies();


    const taxonomies = initialData.taxonomies;

    const insertPromises = [];


    taxonomies.forEach(taxonomy => {
      insertPromises.push(
        this.taxonomiesService.create(taxonomy)
      );
    });


    await Promise.all(insertPromises);

    return true;
  }
}
