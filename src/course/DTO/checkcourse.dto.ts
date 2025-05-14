
import { IsString, IsUrl, IsNotEmpty, IsOptional, IsNumber,Min } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  level: string;

  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  duration: string;

  @IsUrl()
  @IsOptional() 
  link?: string;

  @IsNumber()
  @Min(0)
   price:number;

  @IsString()
  @IsOptional()
  status?: string; 
}