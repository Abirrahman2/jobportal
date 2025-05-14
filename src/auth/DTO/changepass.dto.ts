import { IsNotEmpty, IsString,MinLength } from "class-validator";

export class ChangePasswordDto{
    @IsString()
    oldPassword:string;
    @IsString()
    @MinLength(8,{message:'password is too small,minimum length is 8'})
    newPassword:string;
}