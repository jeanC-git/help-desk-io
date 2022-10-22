import { IsObject, IsOptional, IsString, IsUUID } from "class-validator";
import { User } from "src/auth/entities/user.entity";


interface TicketResponseInterface {
    title: string;
    body: string;
}


export class UpdateTicketStatusDto {

    @IsString()
    updateToStatusCode: string;

    @IsString()
    @IsOptional()
    @IsUUID()
    creator?: User;
    
    @IsString()
    @IsOptional()
    @IsUUID()
    assignTo?: User;


    @IsObject()
    @IsOptional()
    response?: TicketResponseInterface;
}
