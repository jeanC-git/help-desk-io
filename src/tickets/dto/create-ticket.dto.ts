import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsOptional, IsString, IsUUID, MinLength } from "class-validator";
import { User } from "src/auth/entities/user.entity";
import { Taxonomy } from "src/taxonomies/entities/taxonomy.entity";
import { Ticket } from "../entities/ticket.entity";



export class CreateTicketDto {

    @ApiProperty()
    @IsString()
    @MinLength(10)
    title: string;


    @ApiProperty()
    @IsString()
    @MinLength(20)
    body: string;


    @ApiProperty()
    @IsString()
    @IsUUID()
    creator: User;


    @ApiProperty()
    @IsString()
    @IsUUID()
    @IsOptional()
    type?: Taxonomy;

        
    @ApiProperty()
    @IsString()
    @IsUUID()
    @IsOptional()
    parent_ticket?: Ticket;


    @ApiProperty()
    @IsDateString()
    @IsOptional()
    resolvedAt?: Date;


    @ApiProperty()
    @IsDateString()
    @IsOptional()
    closedAt?: Date;


    @ApiProperty()
    @IsDateString()
    @IsOptional()
    finishedAt?: Date;

}
