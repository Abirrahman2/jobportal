import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { UsersModule } from 'src/users/users.module';
import { CompanyRequest } from './companyRequest.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Company,CompanyRequest]),UsersModule],
  controllers: [CompanyController],
  providers: [CompanyService]
})
export class CompanyModule {}
