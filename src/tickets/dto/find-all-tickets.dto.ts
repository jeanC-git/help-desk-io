import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';


export class FindAllTicketDto extends PartialType(PaginationDto) {

    @ApiProperty()
    @IsOptional()
    @IsString()
    filter? : string;


    @ApiProperty()
    @IsOptional()
    @IsString()
    tags? : string;
}