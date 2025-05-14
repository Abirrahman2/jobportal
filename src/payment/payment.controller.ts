import { Body, Controller, Post,UseGuards,Request, Get,Param,Headers,RawBodyRequest,RawBody,Req, Res, BadRequestException } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreatePaymentDto } from './DTO/createpayment.dto';
import { ReturnDocument } from 'typeorm';
import { request } from 'http';
@Controller('payment')

export class PaymentController {

    constructor(private paymentService:PaymentService){}
    @Post('/create-checkout-session')
    @Roles('user')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    async createSession(@Body() body:CreatePaymentDto, @Req() req)
    {
      
        return await this.paymentService.createSession(req.user.userId,body);
    }
  @Get('/checkout-session')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async getCheckoutSession(@Body() body) {
    console.log(body);
    const sessionId=body.sessionId;
    return await this.paymentService.getCheckoutSession(sessionId);
  }
  @Post('/webhook')
  async handleStripeWebhook(@Req() request:Request,
  @Headers('stripe-signature') signature:string

 )
   {
    const rawBody=request['rawBody'];
    console.log(signature);
    if(!rawBody)
    {
      throw new BadRequestException('raw body not found');
    }
    return this.paymentService.handleWebhook(Buffer.from(rawBody),signature);
  }
  @Get('/user')
  @Roles('user')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  async findUser(@Req() req)
  {
    return await this.paymentService.findUser(req.user.userId);
  }
  
  @Get('/success')
  async success(@Res({passthrough:true}) res):Promise<any>
  {
    return this.paymentService.success(res.req.query.session_id);
  }
}
