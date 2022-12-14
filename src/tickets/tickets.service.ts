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
import { AuthService } from 'src/auth/auth.service';
import { AddRecordDto } from './dto/add-record.dto';
import { OptionsFindAllTickets } from './interfaces/OptionsFindAllTickets';
import { logTime } from '../common/helpers/commons.helpers';


@Injectable()
export class TicketsService {

  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
    private readonly taxonomyService: TaxonomiesService,
    private readonly userService: AuthService,
    private readonly dataSource: DataSource,
  ) {
  }


  // =================================== TICKETS ======================================

  async create(createTicketDto: CreateTicketDto) {

    try {
      const ticket = this.ticketRepository.create(createTicketDto);

      ticket.status = await this.getInitTicketStatus();

      if (!createTicketDto.type) {
        ticket.type = await this.getDefaultTicketType();
      }

      await this.ticketRepository.save(ticket);

      await this.addFirstTicketRecord(ticket, createTicketDto.creator);

      return;

    } catch (error) {
      handleDBExceptions(error, `TicketsService.create`);
    }
  }

  async update(ticket: Ticket, updateTicketDto: UpdateTicketDto) {

    // const ticketDB = await this.ticketRepository.preload({ id: ticket.id, ...updateTicketDto });

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // await queryRunner.manager.save(ticketDB);
      await queryRunner.manager.update(Ticket, ticket.id, updateTicketDto);

      await queryRunner.commitTransaction();

      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      handleDBExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    queryParams: FindAllTicketDto,
    options: OptionsFindAllTickets = { loadCreator: false, loadRecords: false },
  ) {
    const { limit = 10, offset = 0, filter = null, tags = null } = queryParams;

    const query = this.ticketRepository.createQueryBuilder('tickets');

    if (filter)
      query.where(`
        tickets.title ilike :filter 
        or tickets.body ilike :filter`
        , { filter: `%${filter}%` });


    if (tags) {
      //
    }


    if (options.loadCreator)
      query.leftJoinAndSelect(`tickets.creator`, 'creator');


    if (options.loadRecords) {
      query.leftJoinAndSelect(`tickets.records`, 'records');
      query.leftJoinAndSelect('records.type', 'record_type');
    }


    query.leftJoinAndSelect(`tickets.type`, 'type');
    query.leftJoinAndSelect(`tickets.status`, 'status');

    return await query
      .take(limit)
      .offset(offset)
      .getMany();
  }

  async findOne(id: string) {
    const ticket = await this.ticketRepository.findOneBy({ id });

    if (!ticket) throw new NotFoundException(`Ticket with ID: ${id} not found.`);

    return ticket;
  }

  async remove(id: string) {
    const ticket = await this.findOne(id);

    await this.ticketRepository.softRemove(ticket);
  }

  async updateTicketStatus(ticket: Ticket, updateTicketStatus: UpdateTicketStatusDto) {
    const currentStatus = await this.ticketRepository.createQueryBuilder()
      .relation(Ticket, 'status')
      .of(ticket)
      .loadOne();

    const newStatus = await this.taxonomyService.findOne('ticket', 'status', updateTicketStatus.updateToStatusCode, 'Ticket status');

    console.log('Ticket will be updated to :');

    console.log({ newStatus });


    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      ticket.status = newStatus;

      await this.generateRecordsOnUpdateStatus(ticket, currentStatus, newStatus, updateTicketStatus);

      await this.ticketRepository.save(ticket);

      await queryRunner.commitTransaction();
      await queryRunner.release();


    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      handleDBExceptions(error);
    }
  }


  // =================================== TICKET RECORDS ======================================

  // async addTicketRecord(title: string, body: string, type: Taxonomy, ticket: Ticket, user: User = null) {
  async addTicketRecord(ticket: Ticket, addTicketRecord: AddRecordDto) {
    const record = this.recordRepository.create({
      ticket,
      ...addTicketRecord,
    });

    await this.recordRepository.save(record);
  }

  async addFirstTicketRecord(ticket: Ticket, user: User) {
    const title = `Ticket was created.`;
    const body = ``;

    await this.generateRecord(title, body, ticket, 'system-history', user);
  }

  async generateRecord(title: string, body: string, ticket: Ticket, recordTypeCode: string, user: User = null) {
    const type = await this.taxonomyService.findOne('record', 'type', recordTypeCode, 'Record status');

    await this.addTicketRecord(ticket, { title, body, type, creator: user });
  }

  async generateStatusHistoryRecord(ticket: Ticket, newStatus: Taxonomy) {
    const title = `Ticket status changed to ${newStatus.name}.`;

    await this.generateRecord(
      title,
      ``,
      ticket,
      'status-history',
    );
  }

  async generateCustomerResponseRecord(ticket: Ticket, data: UpdateTicketStatusDto) {
    const { response } = data;
    await this.generateRecord(
      response.title,
      response.body,
      ticket,
      'customer-response',
    );
  }

  async generateSupportRepResponseRecord(ticket: Ticket, data: UpdateTicketStatusDto) {
    const { response } = data;
    await this.generateRecord(
      response.title,
      response.body,
      ticket,
      'support-rep-response',
    );
  }

  async generateAssignmentHistoryRecord(ticket: Ticket, newStatus: Taxonomy, data: UpdateTicketStatusDto) {
    const assignedUser = await this.userService.findOne(data.assignTo.id);

    const title = `Ticket was assigned to ${assignedUser.fullName} (${assignedUser.id})`;
    await this.generateRecord(
      title,
      ``,
      ticket,
      'assignment-history',
    );
  }

  async generateSystemHistoryRecord(ticket: Ticket, newStatus: Taxonomy) {
    const title = `Ticket status was updated to: ${newStatus.name}.`;
    await this.generateRecord(
      title,
      ``,
      ticket,
      'system-history');
  }

  async generateRecordsOnUpdateStatus(ticket: Ticket, currentStatus: Taxonomy, newStatus: Taxonomy, data: UpdateTicketStatusDto) {
    const case1 = currentStatus.code === 'opened' && newStatus.code === 'assigned';
    const case2 = currentStatus.code === 'assigned' && newStatus.code === 'in-progress';
    const case3 = newStatus.code === 'canceled';

    if (case1) await this.fromOpenToAssigned(ticket, newStatus, data);

    else if (case2) await this.fromAssignedToInProgress(ticket, newStatus);

    else if (currentStatus.code === 'in-progress') {

      // (Case 2.1)
      if (newStatus.code === 'resolved') await this.fromInProgressToResolved(ticket, newStatus);

      // (Case 2.2)
      if (newStatus.code === 'on-hold') await this.fromInProgressToOnHold(ticket, newStatus, data);

      // (Case 2.3)
      if (newStatus.code === 'assigned') await this.fromInProgressToAssigned(ticket, newStatus, data);

    } else if (currentStatus.code === 'resolved') {

      // (Case 2.1.1)
      if (newStatus.code === 'closed') await this.fromResolvedToClosed(ticket, newStatus);

      // (Case 2.1.2)
      if (newStatus.code === 'in-progress') await this.fromResolvedToInProgress(ticket, newStatus);

      // (Case 2.2.2
    } else if (currentStatus.code === 'on-hold' && newStatus.code === 'in-progress')
      await this.fromOnHoldToInProgress(ticket, newStatus, data);

    // (Case 3)
    else if (case3) await this.fromAnyToCanceled(ticket, newStatus);

  }


  // =================================== TICKET STATUS ======================================

  async getInitTicketStatus() {
    return await this.taxonomyService.findOne('ticket', 'status', 'opened', 'Record status');
  }

  async fromOpenToAssigned(ticket: Ticket, newStatus: Taxonomy, data: UpdateTicketStatusDto) {

    const assignedUser = await this.userService.findOne(data.assignTo.id);

    const title1 = `Ticket was assigned to ${assignedUser.fullName} (${assignedUser.id})`;
    await this.generateRecord(
      title1,
      ``,
      ticket,
      'assignment-history',
    );

    await this.generateStatusHistoryRecord(ticket, newStatus);
    // const title2 = `Ticket status changed to ${newStatus.name}.`;
    // await this.generateRecord(
    //   title2,
    //   ``,
    //   ticket,
    //   'status-history',
    // );
  }

  async fromAssignedToInProgress(ticket: Ticket, newStatus: Taxonomy) {
    await this.generateStatusHistoryRecord(ticket, newStatus);
    // const title = `Ticket status changed to ${newStatus.name}.`;
    // await this.generateRecord(
    //   title,
    //   ``,
    //   ticket,
    //   'status-history');
  }

  async fromInProgressToResolved(ticket: Ticket, newStatus: Taxonomy) {
    await this.generateStatusHistoryRecord(ticket, newStatus);
    // const title = `Ticket status changed to ${newStatus.name}.`;
    // await this.generateRecord(
    //   title,
    //   ``,
    //   ticket,
    //   'status-history');
  }

  async fromInProgressToOnHold(ticket: Ticket, newStatus: Taxonomy, data: UpdateTicketStatusDto) {
    await this.generateStatusHistoryRecord(ticket, newStatus);
    // const title = `Ticket status changed to ${newStatus.name}.`;
    // await this.generateRecord(
    //   title,
    //   ``,
    //   ticket,
    //   'status-history');

    await this.generateSupportRepResponseRecord(ticket, data);
    // const { response } = data;
    // await this.generateRecord(
    //   response.title,
    //   response.body,
    //   ticket,
    //   'support-rep-response',
    // );
  }

  async fromInProgressToAssigned(ticket: Ticket, newStatus: Taxonomy, data: UpdateTicketStatusDto) {
    await this.generateStatusHistoryRecord(ticket, newStatus);
    // const title = `Ticket status changed to ${newStatus.name}.`;
    // await this.generateRecord(
    //   title,
    //   ``,
    //   ticket,
    //   'status-history');

    await this.generateAssignmentHistoryRecord(ticket, newStatus, data);
    // const assignedUser = await this.userService.findOne(data.assignTo.id);

    // const title1 = `Ticket was assigned to ${assignedUser.fullName} (${assignedUser.id})`;
    // await this.generateRecord(
    //   title1,
    //   ``,
    //   ticket,
    //   'assignment-history',
    // );

    await this.generateSupportRepResponseRecord(ticket, data);
    // const { response } = data;
    // await this.generateRecord(
    //   response.title,
    //   response.body,
    //   ticket,
    //   'support-rep-response',
    // );
  }

  async fromResolvedToClosed(ticket: Ticket, newStatus: Taxonomy) {

    await this.generateStatusHistoryRecord(ticket, newStatus);
    // const title = `Ticket status changed to ${newStatus.name}.`;
    // await this.generateRecord(
    //   title,
    //   ``,
    //   ticket,
    //   'status-history');

    await this.generateSystemHistoryRecord(ticket, newStatus);
    // const title2 = `Ticket status was updated to: ${newStatus.name}.`;
    // await this.generateRecord(
    //   title2,
    //   ``,
    //   ticket,
    //   'system-history');
  }

  async fromResolvedToInProgress(ticket: Ticket, newStatus: Taxonomy) {
    await this.generateStatusHistoryRecord(ticket, newStatus);
    // const title = `Ticket status changed to ${newStatus.name}.`;
    // await this.generateRecord(
    //   title,
    //   ``,
    //   ticket,
    //   'status-history');

    await this.generateSystemHistoryRecord(ticket, newStatus);
    // const title2 = `Ticket status was updated to: ${newStatus.name}`;
    // await this.generateRecord(
    //   title2,
    //   ``,
    //   ticket,
    //   'system-history');
  }

  async fromOnHoldToInProgress(ticket: Ticket, newStatus: Taxonomy, data: UpdateTicketStatusDto) {
    await this.generateStatusHistoryRecord(ticket, newStatus);
    // const title = `Ticket status changed to ${newStatus.name}.`;
    // await this.generateRecord(
    //   title,
    //   ``,
    //   ticket,
    //   'status-history');

    await this.generateCustomerResponseRecord(ticket, data);
    // const { response } = data;
    // await this.generateRecord(
    //   response.title,
    //   response.body,
    //   ticket,
    //   'customer-response',
    // );
  }

  async fromAnyToCanceled(ticket: Ticket, newStatus: Taxonomy) {
    await this.generateStatusHistoryRecord(ticket, newStatus);
    // const title = `Ticket status changed to ${newStatus.name}.`;
    // await this.generateRecord(
    //   title,
    //   ``,
    //   ticket,
    //   'status-history');

    await this.generateSystemHistoryRecord(ticket, newStatus);
    // const title2 = `Ticket status was updated to: ${newStatus.name}.`;
    // await this.generateRecord(
    //   title2,
    //   ``,
    //   ticket,
    //   'system-history');
  }

  // =================================== TICKET TYPE ======================================
  async getDefaultTicketType() {
    return await this.taxonomyService.findOne('ticket', 'type', 'user-request', 'Record status');
  }

}
