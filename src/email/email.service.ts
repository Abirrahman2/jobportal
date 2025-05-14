import { Injectable } from '@nestjs/common';
import * as nodemailer from  'nodemailer';
import { ConfigService } from '@nestjs/config';
import { sendEmailDto } from './DTO/email.dto';
@Injectable()
export class EmailService {
    constructor(private configService:ConfigService){}
         emailTransport()
         {
            const transporter=nodemailer.createTransport({
                host:this.configService.get<string>('EMAIL_HOST'),
                port:this.configService.get<string>('EMAIL_PORT'),
                secure:false,
                auth:{
                    user:this.configService.get<string>('EMAIL_USER'),
                    pass:this.configService.get<string>('EMAIL_PASSWORD'),
                },
            })
            return transporter;
         }
         async sendEmail(dto:sendEmailDto)
         {
            const {recipients,subject,html}=dto;
            const transport=this.emailTransport();
            const options:nodemailer.SendMailOptions={
                from:this.configService.get<string>('EMAIL_USER'),
                to:recipients,
                subject:subject,
                html:html,
            };
            try{
               await transport.sendMail(options);
               console.log('success');
              // return 'successfully send email';
            }
            catch(error){
                 console.log('Erron sending:',error);
                 //return error;
            }
         }
         async sendPasswordResetEmail(to:string,token:string)
         {
            const resettoken=token;
            
            const transport=this.emailTransport();
            const options:nodemailer.SendMailOptions={
                from:this.configService.get<string>('EMAIL_USER'),
                to:to,
                subject:'PASSWORD RESET REQUEST',
                html:`<p> Your requested a password reset.Copy the token to reset password.${resettoken}>`,
            };
            try{
               await transport.sendMail(options);
               console.log('success reset mail sent');
              // return 'successfully send email';
            }
            catch(error){
                 console.log('Erron sending:',error);
                 //return error;
            }
         }

}
