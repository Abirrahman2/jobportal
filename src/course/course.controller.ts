import { Controller,Post,UseGuards,UseInterceptors,UploadedFile,Body,UsePipes,ValidationPipe,Patch,Param, Put,BadRequestException,Request, Get, Query} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CourseService } from './course.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import { extname } from 'path';
import { Express } from 'express';
import { Course } from './course.entity';
import { CreateCourseDto } from './DTO/checkcourse.dto'
import {UpdatePriceDto} from './DTO/checkupdatePrice.dto'
import { UpdateStatusDto } from './DTO/updateStatus.dto';
@Controller('course')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CourseController {
    constructor(private courseService:CourseService){}
    @Post('createPost')
    @Roles('admin')
    @UseInterceptors(
        FileInterceptor('file', {
          storage: diskStorage({
            destination: './files',
            filename: (req, file, callback) => {
              const suffix = Date.now();
              const ex = extname(file.originalname).toLowerCase();
              const filename = `course_${suffix}${ex}`;
              callback(null, filename);
            },
          }),
        }),
      )
      async create(
        @Body() createCourseDto: CreateCourseDto,
        @UploadedFile() file: Express.Multer.File,
      ): Promise<Course> {
        try {
            let fileUrl: string | undefined;
            if (file) {
              fileUrl = `http://localhost:3000/files/${file.filename}`;
            }
            return await this.courseService.create(createCourseDto, fileUrl);
          } catch (error) {
            console.error('Error creating course:', error.stack); // Log for debugging
            throw new BadRequestException(`Failed to create course: ${error.message}`);
          }
      }
        @Roles('admin')
        @Put('/updatePrice')
        async updatePrice(@Query('id')id:number,@Body()body:UpdatePriceDto)
        {
            return this.courseService.updatePrice(id,body);
        }

        @Roles('admin')
        @Put('/updateStatus')
        async updateStatus(@Query('id')id:number,@Body()body:UpdateStatusDto)
        {
            return this.courseService.updateStatus(id,body);
        }
      
       @Roles('user')
       @Post('/buyCourse')
       async buyCourse(@Query('courseId') courseId:number,@Request() req)
       {
            const userId=req.user.userId;
            return await this.courseService.buyCourse(userId,courseId);
       }
       @Roles('admin')
       @Get('/sendEmailManual')
       async sendEmailManual()
       {
        return await this.courseService.sendThankManual();
       }
}
