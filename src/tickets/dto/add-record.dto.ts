import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID, MinLength } from "class-validator";
import { User } from "src/auth/entities/user.entity";



export class AddRecordDto {

    @ApiProperty()
    @IsString()
    @MinLength(10)
    title: string;


    @ApiProperty()
    @IsString()
    @MinLength(10)
    body: string;


    @ApiProperty()
    @IsString()
    @IsUUID()
    creator: User;
}
