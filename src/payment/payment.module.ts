import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Purchase } from './purchase.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/course/course.entity';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/email/email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DeleteUser } from 'src/users/deletedusers.entity';
import { CourseModule } from 'src/course/course.module';
import { EmailModule } from 'src/email/email.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
@Module({
  imports:[TypeOrmModule.forFeature([Purchase]),CourseModule,ConfigModule,EmailModule,AuthModule,UsersModule],
  controllers: [PaymentController],
  providers: [PaymentService]
})
export class PaymentModule {}
