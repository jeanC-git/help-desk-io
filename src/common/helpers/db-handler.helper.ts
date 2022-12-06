import { BadRequestException, InternalServerErrorException, Logger } from "@nestjs/common";

const DBErros = [
    "23505",
    "23503"
];


export const handleDBExceptions = (error: any, source = 'DB Handler') => {
    const logger = new Logger(source);

    logger.error(error);


    if(DBErros.includes(error.code))
        throw  new BadRequestException(`${error.detail}`);

    // if (error.code === "23505") throw new BadRequestException(`${error.detail}`);
    // if (error.code === "23503") throw new BadRequestException(`${error.detail}`);


    if (error.status == 404) {
        throw new BadRequestException(`${error.message}`);
    }

    console.log({ error });

    throw new InternalServerErrorException("Unexpected error - Check logs.");
}