import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { Ticket } from './entities/ticket.entity';

import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

import { TaxonomiesModule } from '../taxonomies/taxonomies.module';
import { Record } from './entities/record.entity';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  imports: [

    TypeOrmModule.forFeature([Ticket, Record]),

    TaxonomiesModule
  ]
})
export class TicketsModule { }
