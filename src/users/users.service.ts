import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { DeleteUser } from './deletedusers.entity';
import { CreateUserDto } from './DTO/createuser.dto';
import * as bcrypt from 'bcrypt';
import { promises } from 'dns';
import { retry } from 'rxjs';
import { emitWarning } from 'process';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) 
        private userRepository: Repository<User>,

        @InjectRepository(DeleteUser)
        private deleteUserRepository:Repository<DeleteUser>,
    ){}

   
    async findByRole(role:string)
    {
        const users=await this.userRepository.find({where:{role}});
      
        return users;
    }
    async create(userDto:CreateUserDto):Promise<{message:string,user?:User}>{
        const checkuser=await this.userRepository.findOne({where:{email:userDto.email}});
        if(checkuser)
        {
           return {message:'Email already exist'};
        }
        const hashedPass=await bcrypt.hash(userDto.password,10);

        const user=this.userRepository.create({
            ...userDto,
            password:hashedPass
        });
        await this.userRepository.save(user);
        return {message:'successfully added',user};
    }
    async findById(id:number):Promise<any>
    {
        const user=await this.userRepository.findOne({where:{id}});
        return user;
       /* if(user)
        {
            return user;
        }
        return 'user not found';*/
    }
    
    async deleteUserById(id:number):Promise<string>
    {
        const deleteuser=await this.userRepository.findOne({where:{id}});
        if(!deleteuser)
        {
            return 'User is not found';
        }
        if(!deleteuser.isActive)
        {
            return 'Already deleted';
        }
        if(deleteuser.role==='admin')
        {
            return 'Restriction to delete';
        }
        const deleteduser=this.deleteUserRepository.create({

            userId:deleteuser.id,
            firstName:deleteuser.firstName,
            lastName:deleteuser.lastName,
            age:deleteuser.age,
            email:deleteuser.email,
            role:deleteuser.role,
            address:deleteuser.address,
            deletedTime:new Date(),

        });
        await this.deleteUserRepository.save(deleteduser);
        deleteuser.isActive=false;
        await this.userRepository.save(deleteuser);
        return 'successfully deleted the user';
        

    }
    async findActiveUsers(role:string):Promise<User[] | string>
    {
        const users=await this.userRepository.find({where:{isActive:true,role}});
        if(users.length===0)
        {
            return 'there is no user';
        }
        return users;
    }
    async findDeletedUsers(role:string):Promise<DeleteUser[]|string>
    {
        const deletedUsers=await this.deleteUserRepository.find({where:{role}});
        if(deletedUsers.length===0)
        {
            return 'there is no deleted user';
        }
        return deletedUsers;
    }

    async restoreUserStatus(id:number)
    {
        const user=await this.userRepository.findOne({where:{id}});
        if(!user)
        {
            return 'there is no user by this id';
        }
        const restoreuser=await this.deleteUserRepository.findOne({where:{userId:id}});
        if(!restoreuser)
        {
            return 'Already active user';
        }
        user.isActive=true;
        await this.userRepository.save(user);
        await this.deleteUserRepository.delete({userId:id});
        return 'successfully restored the deleted user';
        
    }
    
    async updateUser(id:number,body:CreateUserDto)
    {
        const user=await this.userRepository.findOne({where:{id}});
        if(!user)
        {
            return 'Invalid user';
        }
        if(!user.isActive)
        {
            return 'this user is not a current active user';
        }
        await this.userRepository.update(id,body);
        return 'user update successfully';


    }
    async userCount(role:string)
    {
        if(role !=='user' && role!=='recruiter')
        {
            return 'Invalid role'; 
        }
        const count=await this.userRepository.count({where:{role,isActive:true}});
        return count;
    }
    async deletedUserCount(role:string)
    {
        if(role !=='user' && role!=='recruiter')
        {
            return 'Invalid role'; 
        }
        const count=await this.deleteUserRepository.count({where:{role}});
        return count;
    }
    async findByEmail(email:string):Promise<User|null>
    {
        return await this.userRepository.findOne({where:{email}});
    }

}
