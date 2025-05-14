import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { Repository } from 'typeorm';
import { CreateCourseDto } from './DTO/checkcourse.dto';
import { UpdatePriceDto } from './DTO/checkupdatePrice.dto';
import { CourseUserInfo } from './courseUserInfo.entity';
import { privateDecrypt } from 'crypto';
import { EmailService } from 'src/email/email.service';
import { UpdateStatusDto } from './DTO/updateStatus.dto';
import { sendEmailDto } from 'src/email/DTO/email.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
@Injectable()
export class CourseService {

    constructor(
        @InjectRepository(Course)
        private courseRepository:Repository<Course>,
        @InjectRepository(CourseUserInfo)
        private courseUserInfoRepo:Repository<CourseUserInfo>,
        private emailService:EmailService,
    ){}
    async create(createCourseDto: CreateCourseDto, fileUrl?: string): Promise<Course> {
        if(!fileUrl && !createCourseDto.link)
        {
            throw new BadRequestException('Please provide file or link');
        }
        const courseData = {
          ...createCourseDto,
          link: fileUrl || createCourseDto.link,
          status: createCourseDto.status || 'not published',
          createdDate: new Date(),
        };
        const course = this.courseRepository.create(courseData);
        return await this.courseRepository.save(course);
      }

      async updatePrice(id:number,body:UpdatePriceDto)
      {
        
    
        const course=await this.courseRepository.findOne({where:{id}});
        if(!course)
        {
            return 'there is no course by this id';
        }
        
        await this.courseRepository.update(id,{price:body.price});
        return 'successfully updated the course plan';
        
    
      }
       async findById(id:number):Promise<Course | null>
          {
              const course=await this.courseRepository.findOne({where:{id}});
              return course;
             /* if(user)
              {
                  return user;
              }
              return 'user not found';*/
          }
          
      async updateStatus(id:number,body:UpdateStatusDto)
      {
        
    
        const course=await this.courseRepository.findOne({where:{id}});
        if(!course)
        {
            return 'there is no course by this id';
        }
        if(course.status==body.status)
        {
          return `already ${course.status}`;
        }
        await this.courseRepository.update(id,{status:body.status});
        return 'successfully updated the course status';
        
    
      }

      async buyCourse(userId:number,courseId:number):Promise<string>{
        const course=await this.courseRepository.findOne({where:{id:courseId}});
        if(!course)
        {
          throw new BadRequestException('COURSE IS NOT AVAILABLE');
        }
        if(course.status!=='published')
        {
          return 'course is not published yet, wait until it published';
        }
        const check=await this.courseUserInfoRepo.findOne({where:{userId,courseId}});
        if(check)
        {
          return 'You have already bought this course';
        }
         const courseUser=this.courseUserInfoRepo.create({
           userId,
           courseId,
           purchaseTime:new Date(),
           status:'pending',
         });
         await this.courseUserInfoRepo.save(courseUser);
         return 'successfully purchased';
      }
      
      async sendThankManual()
      {
        
        const pendingCourses = await this.courseUserInfoRepo.find({
          where: { status: 'pending' },
          relations: ['user', 'course'],
        });
        if(pendingCourses.length===0)
        {
          return 'No available status.'
        }
        for (const pending of pendingCourses) {
          const emailDto: sendEmailDto = {
            recipients: pending.user.email,
            subject: `Thank You for buying this ${pending.course.title} course`,
            html: `
              <h1>Thank You for Your Purchase</h1>
              <p> practacing nestjs framework ,so dont be serious if you get this email.</p>
            `,
          };
          try {
            await this.emailService.sendEmail(emailDto);
            pending.status = 'done';
            await this.courseUserInfoRepo.save(pending);
           // return 'successfully send the email';
          } catch (error) {
            console.error(`Can not send email at ${pending.user.email}:`, error);
          }


      }
    }
    //@Cron(CronExpression.EVERY_5_MINUTES)
    //@Cron(CronExpression.EVERY_MINUTE)
      async sendThankSchedule()
      {
        const pendingCourses = await this.courseUserInfoRepo.find({
          where: { status: 'pending' },
          relations: ['user', 'course'],
        });
        if(pendingCourses.length===0)
        {
          console.log('no available status');
          return 'No available status.'
        }
        for (const pending of pendingCourses) {
          const emailDto: sendEmailDto = {
            recipients: pending.user.email,
            subject: `Thank You for buying this ${pending.course.title} course`,
            html: `
              <h1>Thank You for Your Purchase</h1>
              <p> practacing nestjs framework ,so dont be serious if you get this email.</p>
            `,
          };
          try {
            await this.emailService.sendEmail(emailDto);
            pending.status = 'done';
            await this.courseUserInfoRepo.save(pending);
            //return 'successfully send the email';
          } catch (error) {
            console.error(`Can not send email at ${pending.user.email}:`, error);
          }


      }
    }

}
