import { Body, Controller, Post, UnauthorizedException,Req ,UseGuards, BadRequestException,Put} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from './DTO/changepass.dto';
import { ForgotPasswordDto } from './DTO/forgotpass.dto';
import { ResetPasswordDto } from './DTO/reserpass.dto';
@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}
    @Post('login')
    async login(@Body() body:{email:string;password:string})
    {
        const user=await this.authService.validUser(body.email,body.password);
        if(!user)
        {

            throw new UnauthorizedException('Wrong email and passwords');
        }
        return this.authService.login(user);
    }
    
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req) {
    const token = req.headers.authorization.split(' ')[1];
    if(!token)
    {
        throw new BadRequestException('no token is provided yet');
    }
    return this.authService.logout(token);
  }
  @Put('changePassword')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(@Body() changePasswordDto:ChangePasswordDto,@Req() req)
  {
    return this.authService.changePassword(
      req.user.userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }
  @Post('forgotPassword')
  async forgotPassword(@Body() forgotPasswordDto:ForgotPasswordDto)
  {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }
  @Put('resetPassword')
  async resetPassword(@Body() resetPasswordDto:ResetPasswordDto)
  {
      return this.authService.resetPassword(
        resetPasswordDto.newPassword,
        resetPasswordDto.resetToken,
      );
  }


}
