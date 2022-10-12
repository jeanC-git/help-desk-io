import { ApiProperty, PartialType } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString, Min } from 'class-validator';
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