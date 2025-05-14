import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity'
import { DeleteUser } from './users/deletedusers.entity';
import { CompanyModule } from './company/company.module';
import { Company } from './company/company.entity';
import { CompanyRequest } from './company/companyRequest.entity';
import { AuthModule } from './auth/auth.module';
import { UploadModule } from './upload/upload.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from './course/course.module';
import { Course } from './course/course.entity';
import { CourseUserInfo } from './course/courseUserInfo.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { PasswordResetToken } from './auth/resettoken.entity';
import { PaymentModule } from './payment/payment.module';
import { Purchase } from './payment/purchase.entity';
@Module({
  imports: [CacheModule.register({isGlobal:true,ttl:86400,}),UsersModule,TypeOrmModule.forRoot({


    type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'jobkhuji',
      entities: [User,DeleteUser,Company,CompanyRequest,Course,CourseUserInfo,PasswordResetToken,Purchase],
      synchronize: true,
      autoLoadEntities:true,
  }), CompanyModule, AuthModule, UploadModule, EmailModule,ConfigModule.forRoot(), CourseModule,ScheduleModule.forRoot(), PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
