import { IsString, IsUUID, MinLength } from "class-validator";
import { Taxonomy } from "src/taxonomies/entities/taxonomy.entity";



export class UpdateTicketStatusDto {

    @IsString()
    status: string;
}
