import { IsNumber, IsOptional,Min } from 'class-validator';

export class UpdatePriceDto {
  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'Price must be non-negative' })
  price?: number;
}