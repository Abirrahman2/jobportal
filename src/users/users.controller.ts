import { Controller, Get,Post,Body, Param, Delete, ParseIntPipe, Patch,Put, UseGuards,Request, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './DTO/createuser.dto';
import { get } from 'http';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
    constructor(private usersService:UsersService){}

    @Get('/user')
    @Roles('admin')
    async findAllUsers(){
        const users= await this.usersService.findByRole('user');
        if(users.length===0)
        {
            return 'No user found'
        }
        return users;
    }
    @Roles('admin')
    @Get('/recruiter')
    async findAllRecruiters()
    {
        const recruiters=await this.usersService.findByRole('recruiter');
        if(recruiters.length===0)
        {
            return 'No Recruiter found';
        }
        return recruiters;
    }
    @Roles('admin')
    @Post('/addUser')
    async createUser(@Body() body:CreateUserDto,@Request() req)
    {
        const check= await this.usersService.create(body);
        return check;
    }
    @Roles('admin')
    @Get('/:id')
    async findById(@Param('id')id:number)
    {
        return this.usersService.findById(id);
    }
    @Roles('admin')
    @Delete('/delete/:id')
    async deleteUserById(@Param('id',ParseIntPipe)id:number)
    {
        return this.usersService.deleteUserById(id);
    }
    @Roles('admin')
    @Get('/activeuser/:role')
    async findActiveUsers(@Param('role')role:string)
    {
      return this.usersService.findActiveUsers(role);
    }
    @Roles('admin')
    @Get('/deleteduser/:role')
    async findDeletedUsers(@Param('role')role:string)
    {
        return this.usersService.findDeletedUsers(role);
    }
    @Roles('admin')
    @Patch('/restoreUserStatus/:id')
    async restoreUserStatus(@Param('id')id:number)
    {
        return this.usersService.restoreUserStatus(id);
    }
    @Roles('admin')
    @Put('/update')
    async updateUser(@Query('id')id:number,@Body()body:CreateUserDto)
    {
        return this.usersService.updateUser(id,body);
    }
    @Roles('admin')
    @Get('/userCount/:role')
    async countUsers(@Param('role')role:string)
    {

        const count=await this.usersService.userCount(role);
        return count;
    }
    @Roles('admin')
    @Get('/deletedUserCount/:role')
    async deletedUserCount(@Param('role')role:string)
    {
        const count=await this.usersService.deletedUserCount(role);
        return count;
    }


}
