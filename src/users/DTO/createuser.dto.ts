import { IsNotEmpty,IsEmail, IsString, IsInt, MinLength, IsOptional, IsBoolean } from "class-validator";

export class CreateUserDto{
     @IsNotEmpty()
     @IsString()
     firstName:string;
     @IsNotEmpty()
     @IsString()
     lastName:string;

     @IsNotEmpty()
     @IsInt()
     age:number;

     @IsEmail()
     @IsNotEmpty()
     email:string

     @IsNotEmpty()
     @MinLength(8,{message:'password is too small,minimum length is 8'})
     password:string;

     @IsString()
     address:string;

     @IsString()
     role:string='user';
     @IsBoolean()
     isActive:boolean=true;

     


}