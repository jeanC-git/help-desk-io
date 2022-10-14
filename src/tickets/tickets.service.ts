import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { handleDBExceptions } from 'src/common/helpers';

import { Ticket } from './entities/ticket.entity';
import { Record } from './entities/record.entity';

import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { FindAllTicketDto } from './dto/find-all-tickets.dto';
import { Taxonomy } from 'src/taxonomies/entities/taxonomy.entity';
import { User } from 'src/auth/entities/user.entity';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { TaxonomiesService } from 'src/taxonomies/taxonomies.service';


@Injectable()
export class TicketsService {

  constructor(

    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,


    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,


    @InjectRepository(Taxonomy)
    private readonly taxonomyRepository: Repository<Taxonomy>,


    private readonly taxonomyService: TaxonomiesService,


    private readonly dataSource: DataSource,
  ) { }


  // =================================== TICKETS ======================================

  async create(createTicketDto: CreateTicketDto) {

    try {
      const ticket = this.ticketRepository.create(createTicketDto);

      const defaultInitStatus = await this.getInitTicketStatus();
      ticket.status = defaultInitStatus;

      if (!createTicketDto.type) {
        const defaultTicketType = await this.getDefaultTicketType();
        ticket.type = defaultTicketType;
      }

      await this.ticketRepository.save(ticket);

      await this.addFirstTicketRecord(ticket, createTicketDto.creator);

      return;

    } catch (error) {
      handleDBExceptions(error, `TicketsService.create`)
    }
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {

    const ticket = await this.ticketRepository.preload({ id, ...updateTicketDto });

    if (!ticket) throw new NotFoundException(`Ticket with ID: ${id} not found.`);

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      await queryRunner.manager.save(ticket);

      await queryRunner.commitTransaction();
      await queryRunner.release()

      return;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      handleDBExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }


  async findAll(queryParams: FindAllTicketDto,
    options:
      { loadCreator: boolean, loadRecords: boolean }
      = { loadCreator: false, loadRecords: false }) {

    const { limit = 10, offset = 0, filter = null, tags = null } = queryParams;

    const query = this.ticketRepository.createQueryBuilder('tickets');

    if (filter)
      query.where(`
        tickets.title ilike :filter 
        or tickets.body ilike :filter`
        , { filter: `%${filter}%` })


    if (tags) {
      //
    }


    if (options.loadCreator)
      query.leftJoinAndSelect(`tickets.creator`, 'creator');


    if (options.loadRecords){
      query.leftJoinAndSelect(`tickets.records`, 'records');
      query.leftJoinAndSelect('records.type', 'record_type')
    }
      


    query.leftJoinAndSelect(`tickets.type`, 'type');
    query.leftJoinAndSelect(`tickets.status`, 'status');

    const tickets = await query
      .take(limit)
      .offset(offset)
      .getMany();

    return tickets;
  }


  async findOne(id: string) {
    const ticket = await this.ticketRepository.findOneBy({ id: id })

    if (!ticket) throw new NotFoundException(`Ticket with ID: ${id} not found.`);

    return ticket;
  }


  async remove(id: string) {
    const ticket = await this.findOne(id);

    await this.ticketRepository.softRemove(ticket);
  }

  async updateTicketStatus(id: string, updateTicketStatus: UpdateTicketStatusDto) {

    const { status } = updateTicketStatus;

    const ticket = await this.findOne(id);

    ticket.status = await this.taxonomyService.findOneByCode(status, 'Status')

    await this.ticketRepository.save(ticket);
  }




  // =================================== TICKET RECORDS ======================================

  async addTicketRecord(title: string, body: string, type: Taxonomy, ticket: Ticket, user: User) {
    // TODO: add record type
    const record = this.recordRepository.create({
      title, body, ticket, type,
      creator: user,
    });

    await this.recordRepository.save(record);
  }

  async addFirstTicketRecord(ticket: Ticket, user: User) {
    const title = `Ticket was created.`;
    const body = ``;

    const systemRecordStatus = await this.taxonomyService.findOneByCode('system-history', 'Record status');

    await this.addTicketRecord(title, body, systemRecordStatus, ticket, user);
  }



  // =================================== TICKET STATUS ======================================

  async getInitTicketStatus() {
    return await this.taxonomyRepository.findOne({
      where: {
        group: 'ticket',
        type: 'status',
        code: 'pending'
      }
    });
  }



  // =================================== TICKET TYPE ======================================
  async getDefaultTicketType() {
    return await this.taxonomyRepository.findOne({
      where: {
        group: 'ticket',
        type: 'type',
        code: 'user-request'
      }
    });
  }

}
