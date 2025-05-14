import { IsNotEmpty,IsEmail, IsString, IsInt, MinLength, IsOptional, IsBoolean, IsNumber, Length, isNotEmpty, isString } from "class-validator";

export class CheckCompany{
    
    @IsNumber()
    recId:number;
    @IsString()
    name:string;
    
    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsString()
    @IsNotEmpty()
    address:string;

    @IsOptional()
    @IsString()
    website:string;
    
    @IsString()
    status:string;

     
    @IsString()
    @Length(12,12)
    tilNumber:string;

}