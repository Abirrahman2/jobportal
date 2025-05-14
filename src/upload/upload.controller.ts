import { Controller, Post, UseInterceptors,UploadedFile,UseGuards,Request} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import { UploadService } from './upload.service';
import { extname } from 'path';
import { Express } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('upload')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UploadController {
    constructor(private readonly uploadService: UploadService){}
    @Post('file')
    @Roles('admin')
    @UseInterceptors(FileInterceptor('file',{
        storage:diskStorage({
            destination:'./files',
            filename:(req,file,callback)=>{
                const suffix=Date.now();
                const ex=extname(file.originalname);
                const filename=`course_${suffix}${ex}`;
                callback(null,filename);
            }
        }),
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File)
    {
        console.log(file);
        return await this.uploadService.saveFile(file);
    }
    

}
