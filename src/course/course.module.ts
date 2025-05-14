import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UploadModule } from 'src/upload/upload.module';
import {CourseUserInfo} from './courseUserInfo.entity'
import { EmailModule } from 'src/email/email.module';
@Module({
  imports:[TypeOrmModule.forFeature([Course,CourseUserInfo]),AuthModule,UploadModule,EmailModule],
  controllers: [CourseController],
  providers: [CourseService],
  exports:[CourseService]
})
export class CourseModule {}
