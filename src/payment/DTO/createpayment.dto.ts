import { IsNumber } from "class-validator";


export class CreatePaymentDto{
    @IsNumber()
    courseId:number;
}