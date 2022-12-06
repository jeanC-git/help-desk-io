import {
  Controller, Get, Post, Body, Patch, Param,
  Delete, Query, ParseUUIDPipe,
} from '@nestjs/common';

import { success } from 'src/common/helpers';

import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { FindAllTicketDto } from './dto/find-all-tickets.dto';
import { FindAllTicketsSerializer } from './serializers/find.serializer';
import { AddRecordDto } from './dto/add-record.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { ParseTicketPipe } from './pipes/parse-ticket.pipe';
import { Ticket } from './entities/ticket.entity';




@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) { }

  // ========================= TICKETS ==============================

  @Post()
  async create(@Body() createTicketDto: CreateTicketDto) {


    // return {
    //   type: typeof createTicketDto.creator
    // };

    await this.ticketsService.create(createTicketDto);

    return success({}, 'Ticket created successfully.');
  }

  @Patch(':id')
  async update(
    @Param('id', ParseTicketPipe) ticket: Ticket,
    @Body() updateTicketDto: UpdateTicketDto) {

    await this.ticketsService.update(ticket, updateTicketDto);

    return success({}, 'Ticket updated successfully.');
  }

  @Get()
  async findAll(@Query() queryParams: FindAllTicketDto) {
    const tickets = await this.ticketsService.findAll(
      queryParams,
      { loadCreator: true, loadRecords: true }
    );

    return success(FindAllTicketsSerializer(tickets));
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const ticket = await this.ticketsService.findOne(id);

    return success(ticket);
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.ticketsService.remove(id);

    return success({}, `Ticket removed successfully.`)
  }

  @Patch(':id/update-status')
  async updateTicketStatus(
    @Param('id', ParseTicketPipe) ticket: Ticket,
    @Body() updateTicketStatusDto: UpdateTicketStatusDto) {

    await this.ticketsService.updateTicketStatus(ticket, updateTicketStatusDto)

    return success({}, `Ticket updated successfully.`)
  }

  // ========================= TICKETS - RECORDS ==============================


  @Post(':id/add-record')
  async addTicketRecord(
    @Param('id', ParseTicketPipe) ticket: Ticket,
    @Body() addRecordDto: AddRecordDto
  ) {

    console.log({ ticket });


    await this.ticketsService.addTicketRecord(ticket, addRecordDto)

    return success({}, `Record created successfully.`);
  }

}
