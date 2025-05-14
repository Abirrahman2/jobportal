import { Body, Controller,Post,UseGuards } from '@nestjs/common';
import { EmailService } from './email.service';
import { sendEmailDto } from './DTO/email.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
@Controller('email')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EmailController {
    constructor(private emailService:EmailService){}
    @Post('send')
    @Roles('admin')
    async sendMail(@Body() dto:sendEmailDto)
    {
         await this.emailService.sendEmail(dto);
        return {message:'Sent Successfully'};
    }
}
