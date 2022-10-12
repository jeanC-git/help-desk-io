import { join } from 'path';

import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';

import * as xlsx from 'xlsx';

@Injectable()
export class FilesService {

    getStaticProductImage(imageName: string) {

        const path = join(__dirname, '../../static/products', imageName);

        if (!existsSync(path)) throw new BadRequestException(`No product found with image name.`);


        return path;

    }

    readExcel(file: Express.Multer.File) {

        let workbook: xlsx.WorkBook = xlsx.readFile(file.path);

        const sheets = workbook.SheetNames;

        const data = [];

        sheets.forEach(sheetName => {
            
            const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

            sheet.forEach((res) => data.push(res));
        });

        return data;
    }

}
