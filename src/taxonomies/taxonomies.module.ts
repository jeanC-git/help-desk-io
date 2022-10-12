import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Taxonomy } from './entities/taxonomy.entity';

import { TaxonomiesService } from './taxonomies.service';
import { TaxonomiesController } from './taxonomies.controller';



@Module({
  controllers: [TaxonomiesController],
  providers: [TaxonomiesService],
  imports: [
    TypeOrmModule.forFeature([Taxonomy]),
  ],
  exports: [
    TaxonomiesService,
    TypeOrmModule,
  ]
})
export class TaxonomiesModule { }
