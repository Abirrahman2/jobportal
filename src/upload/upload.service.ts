import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
    async saveFile(file: Express.Multer.File) {
        const fileInfo = {
            originalName: file.originalname,
            filename: file.filename,
            path: file.path,
            size: file.size,
          };

          console.log('Saved file:',fileInfo);
          return{
            message:'uploaded successfully',
            file:fileInfo,
          };

        }

}
