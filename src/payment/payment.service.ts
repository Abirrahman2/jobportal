import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from 'src/course/course.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { Purchase } from './purchase.entity';
import { UsersService } from 'src/users/users.service';
import { EmailService } from 'src/email/email.service';
import { CreatePaymentDto } from './DTO/createpayment.dto';
import { Session } from 'inspector/promises';
import { CourseService } from 'src/course/course.service';
import { sendEmailDto } from 'src/email/DTO/email.dto';
@Injectable()
export class PaymentService {
    private stripe:Stripe;
    constructor(
        private configService:ConfigService,
        @InjectRepository(Purchase)
        private purchaseRepository:Repository<Purchase>,
        private usersService:UsersService,
        private emailService:EmailService,
        private courseService:CourseService,
        

    ){
      const stripeKey=this.configService.get<string>('STRIPE_SECRET_KEY');
      if(!stripeKey)
      {
        throw new InternalServerErrorException('secret key is not defined');
      }
      this.stripe=new Stripe(stripeKey,{
        apiVersion:'2025-04-30.basil',
      });
    }
    async findUser(userId)
    {
      const user=await this.usersService.findById(userId);
      return user;
    }
    async createSession(userId:number,paymentDto:CreatePaymentDto)
    {
      console.log(userId);
        const {courseId}=paymentDto;
        const course =await this.courseService.findById(courseId);
        if(!course)
        {
            throw new BadGatewayException('Course not found');
        }
        const user=await this.usersService.findById(userId);
        if(typeof user=='string')
        {
            throw new BadRequestException('user not found');
        }
        if(!user)
        {
          throw new BadRequestException('user not found');
        }
        try {
          const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
              {
                price_data: {
                  currency: 'usd',
                  product_data: {
                    name: course.title,
                    description: course.description,
                  },
                  unit_amount: Math.round(course.price * 100),
                },
                quantity: 1,
              },
            ],
            mode: 'payment',
            success_url: `http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/payment/cancel`,
            metadata: {
              userId: userId,
              courseId: courseId,
            },
          });
      
          const purchase = this.purchaseRepository.create({
            userId,
            courseId,
            sessionId: session.id,
            status: session.status,
            amount: course.price,
            currency: 'usd',
            createdAt: new Date(),
          });
          await this.purchaseRepository.save(purchase);
      
          return { sessionId: session.id, url: session.url };
        } catch (error) {
          throw new InternalServerErrorException(`Failed to create Stripe session: ${error.message}`);
        }
        

     
        
    }
    async getCheckoutSession(sessionId: string) {
      try {
        const session = await this.stripe.checkout.sessions.retrieve(sessionId);
        return {
          id: session.id,
          status: session.status,
          payment_status: session.payment_status,
          amount_total: session.amount_total ? session.amount_total / 100 : null,
          currency: session.currency,
          customer_email: session.customer_details?.email || null,
          metadata: session.metadata,
          created: new Date(session.created * 1000).toISOString(),
        };
      } catch (error) {
        throw new BadRequestException(`Failed to retrieve checkout session: ${error.message}`);
      }
    }
    async handleWebhook(rawBody: Buffer, signature: string) {
      const endpointSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
      console.log(endpointSecret);
      let event: Stripe.Event;
      if(!endpointSecret)
      {
        return 'undefined';
      }
      try {
        event = this.stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
      } catch (err) {
        throw new BadRequestException(`Webhook Error: ${err.message}`);
      }
    
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
    
        const purchase = await this.purchaseRepository.findOne({
          where: { sessionId: session.id },
        });
    
        if (purchase)
       {
          purchase.status = 'complete';
          try{
            await this.purchaseRepository.save(purchase);
            console.log('updated');
            const user=await this.usersService.findById(purchase.userId);
           
            const course=await this.courseService.findById(purchase.courseId);
            const emailDto:sendEmailDto={
              recipients:user.email,
              subject:'Thank you for purchasing the course',
              html:`<h1> thank you ${user?.firstName}</h1>
                <p>you succesfully purchase the course</p>
              `,
      

            };
            await this.emailService.sendEmail(emailDto);
            return { received: true };
          }
          catch(error)
          {
            console.log(error);
            return { received: false };
          }
         
           
        }
        else{
          console.log('no purchase happened');
          return { received: true };
        }
      }
      else
      {
        console.log('not recieved');
        return { received: true };
      }
    
      
    }
    async success(session_id:any):Promise<any>{
      const details=await this.stripe.checkout.sessions.listLineItems(
       session_id,
       {limit:5},
      );
      const session=await this.stripe.checkout.sessions.retrieve(session_id);
      console.log(details,session);
    }

    async sendThankYouEmail(sessionId: string,userId:any) {
    const purchase = await this.purchaseRepository.findOne({ where: { sessionId } });
    if (!purchase) {
      throw new BadRequestException('Purchase not found');
    }
    if (purchase.status !== 'complete') {
      throw new BadRequestException('Payment not completed');
    }

    

    return { message: 'Thank-you email sent successfully' };
  }
   
}
