import { Controller, Get,Post,Body, Param, Delete, ParseIntPipe, Patch,Put, UseGuards,Request  } from '@nestjs/common';
import { CompanyService } from './company.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CheckCompany } from './DTO/checkCompany.dto';
@Controller('company')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CompanyController {
    constructor(private companyService:CompanyService){}

    @Get('/companyAll')
    @Roles('admin')
    async getAll()
    {
        const cmp=await this.companyService.findAll();
        return cmp;
    }
    @Post('/createRequest')
    @Roles('recruiter')
    async createRequest(@Body() body:CheckCompany,@Request() req)
    {
      const userId=req.user.userId;
        return await this.companyService.createRequest(userId,body)
    }
    @Patch('/acceptRequestById/:id')
    @Roles('admin')
    async restoreStatus(@Param('id')id:number)
    {
        return await this.companyService.acceptRequest(id);
    }
    @Get('/countcompany')
    @Roles('admin')
    async countCompany()
    {
        return await this.companyService.companyCount();
    }
    @Get('/countPendingCompany')
    @Roles('admin')
    async countPendingCompany()
    {
        return await this.companyService.countPendingCompany();
    }



}
