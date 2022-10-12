import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FilesService } from './files.service';
import { FileFilter, FileNamer } from './helpers';
import { ConfigService } from '@nestjs/config';


@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,

    private readonly configService: ConfigService
  ) { }


  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProductImage(imageName);

    res.sendFile(path);
  }

  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: FileFilter,
    // limits: { fileSize: 1000},
    storage: diskStorage({
      destination: `./static/products`,
      filename: FileNamer
    })
  }))
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File
  ) {

    if (!file) {
      throw new BadRequestException('Make sure that the file is an image. ');
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`


    return { secureUrl };
  }


  @Post('excel')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: FileFilter,
    // limits: { fileSize: 1000},
    storage: diskStorage({
      destination: `./static/files`,
      filename: FileNamer
    })
  }))
  uploadMassiveUsers(
    @UploadedFile() file: Express.Multer.File
  ) {

    if (!file) {
      throw new BadRequestException('File not found.');
    }

    return this.filesService.readExcel(file);
  }
}
