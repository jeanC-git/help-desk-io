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




@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) { }

  // ========================= TICKETS ==============================
  @Post()
  async create(@Body() createTicketDto: CreateTicketDto) {
    await this.ticketsService.create(createTicketDto);

    return success({}, 'Ticket created successfully.');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto) {
    await this.ticketsService.update(id, updateTicketDto);

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
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTicketStatusDto: UpdateTicketStatusDto) {
    await this.ticketsService.updateTicketStatus(id, updateTicketStatusDto)

    return success({}, `Ticket updated successfully.`)
  }

  // ========================= TICKETS - RECORDS ==============================


  @Post(':id/add-record')
  async addTicketRecord(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() addRecordDto: AddRecordDto
  ) {
    const ticket = await this.ticketsService.findOne(id);
    const { title, body, type, creator } = addRecordDto;



    await this.ticketsService.addTicketRecord(title, body, type, ticket, creator)

    return success({}, `Record created successfully.`);
  }

}
