import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { CompanyRequest } from './companyRequest.entity';
import {CheckCompany} from  './DTO/checkCompany.dto'
import { User } from 'src/users/users.entity';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company) private companyRepository:Repository<Company>,
        @InjectRepository(CompanyRequest) private companyRequestRepository:Repository<CompanyRequest>,
        private usersService:UsersService
        
    ){}
   async findAll()
    {
        const cmp= await this.companyRepository.find();
        if(cmp.length===0)
        {
            return 'empty company';
        }
        
        return cmp;
    }
    async createRequest(userId:number,checkCompany:CheckCompany)
    {
        const recruiter = await this.usersService.findById(userId);

        if (!recruiter) {
          return 'Recruiter not found';
        }
    
        const checkExistingRequest= await this.companyRequestRepository.findOne({ where: { recId: userId} });
        if (checkExistingRequest) {
          return 'already requested for a company';
        }
    
        const companyRequest = this.companyRequestRepository.create({
          ...checkCompany,
          recId:userId,
        });

         await this.companyRequestRepository.save(companyRequest);
         return {companyRequest};
    }
    async acceptRequest(id:number)
    {
        const company=await this.companyRequestRepository.findOne({where:{id}});
        if(!company)
        {
            return 'there is no company by this id';
        }
        const checkExist=await this.companyRepository.findOne({where:{tinNumber:company.tinNumber}})
        if(checkExist)
        {
            return 'company with different recruiter';
        }
        company.status="accepted";
        const newCompany=this.companyRepository.create({
            name:company.name,
            companyType:company.companyType,
            email:company.email,
            address:company.address,
            website:company.website,
            status:company.status,
            tinNumber:company.tinNumber,
        });
        await this.companyRepository.save(newCompany);
        await this.companyRequestRepository.save(company);
        
        return 'successfully accepted this company';
    }
    async companyCount()
    {
        
        const count=await this.companyRepository.count({where:{status:'accepted'}});
        return count;
    }
    async countPendingCompany()
    {
        const count=await this.companyRequestRepository.count({where:{status:'pending'}});
        return count;
    }
}


