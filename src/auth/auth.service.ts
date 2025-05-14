import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository,MoreThanOrEqual } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { access } from 'fs';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { resourceLimits } from 'worker_threads';
import { measureMemory } from 'vm';
import { nanoid } from 'nanoid';
import { PasswordResetToken } from './resettoken.entity';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {

    constructor(
        private usersService:UsersService,
        private jwtService:JwtService,
        @InjectRepository(PasswordResetToken) 
         private resetToken: Repository<PasswordResetToken>,
         private emailService:EmailService,
    ){}
    async validUser(email:string,password:string):Promise<any>
    {
        const user=await this.usersService.findByEmail(email);
        if(user && await bcrypt.compare(password,user.password))
        {
            const {password, ...result}=user;
            return result;
        }
        return null;
    }
    async login(user:any)
    {
        const payload={email:user.email,sub:user.id,role:user.role};
        const token=this.jwtService.sign(payload);
        return{
            access_token:token,
            role:user.role,
            id:user.id,
        };
        //return {access_token:this.jwtService.sign(payload),};
    }
    async logout(token:string)
    {
        
    }
    async changePassword(userId:number,oldPassword,newPassword)
    {
        const user=await this.usersService.findById(userId);
        if(!user)
        {
            throw new NotFoundException('wrong credentials');
        }
        const passwordMatch=await bcrypt.compare(oldPassword, user.password);
       if(!passwordMatch)
       {
        throw new UnauthorizedException('wrong credentials');
       }
       const newPass=await bcrypt.hash(newPassword,10);
       user.password=newPass;
       await this.usersService.updateUser(userId,{...user,password:newPass});
    }
    async forgotPassword(email:string)
    {
        const user=await this.usersService.findByEmail(email);

        if(user)
        {
            const resetToken=nanoid(64);
            const expiryDate=new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const resToken= this.resetToken.create({
                token:resetToken,
                userId:user.id,
                expiryDate:expiryDate,
             });
              await this.resetToken.save(resToken);
            this.emailService.sendPasswordResetEmail(email,resetToken);

        }
        

        return {"message":"If the user exist, the user will recieve it"};
    }
    async resetPassword(newPassword:string,resetToken:string)
    {
        const token=await this.resetToken.findOne({where:{token:resetToken,expiryDate: MoreThanOrEqual(new Date())},});
        if(!token)
        {
            throw new UnauthorizedException('Invalid link');
        }
        const user=await this.usersService.findById(token.userId);
        if(!user)
        {
            throw new InternalServerErrorException();
        }
        await this.resetToken.remove(token);
        const newPass=await bcrypt.hash(newPassword,10);
        user.password=newPass;
        await this.usersService.updateUser(token.userId,{...user,password:newPass});
         
    }
}
