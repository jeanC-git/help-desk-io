import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";



export const handleDBExceptions = (error: any, source: string = 'DB Handler') => {
    const logger = new Logger(source);

    logger.error(error);

    if (error.code === "23505") {
        throw new BadRequestException(`${error.detail}`);
    }


    throw new InternalServerErrorException("Unexpected error - Check logs.");
}