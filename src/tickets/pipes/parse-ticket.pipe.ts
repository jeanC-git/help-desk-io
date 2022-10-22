import { ArgumentMetadata, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { TicketsService } from '../tickets.service';

@Injectable()
export class ParseTicketPipe implements PipeTransform {
  constructor(

    private readonly ticketsService: TicketsService,

  ) { }
  async transform(value: any, metadata: ArgumentMetadata) {

    let ticket = await this.ticketsService.findOne(value);
    
    if (!ticket ) throw new NotFoundException(`Ticket with ID "${value}" not found.`);

    return ticket;
  }
}
