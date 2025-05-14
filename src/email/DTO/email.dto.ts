import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class sendEmailDto{

    @IsEmail()
     recipients:string;
     @IsString()
     subject:string;
     @IsString()
     html:string;
     @IsOptional()
     @IsString()
     text?:string


}