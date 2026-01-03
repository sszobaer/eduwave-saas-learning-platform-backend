import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsNumber()
  courseId: number;

  @IsNumber()
  userId: number;

  @IsString()
  @IsNotEmpty()
  cus_name: string;

  @IsString()
  @IsNotEmpty()
  cus_email: string;

  @IsString()
  @IsNotEmpty()
  cus_add1: string;

  @IsString()
  @IsNotEmpty()
  cus_city: string;

  @IsString()
  @IsNotEmpty()
  cus_country: string;

  @IsString()
  @IsNotEmpty()
  cus_phone: string;

  @IsString()
  @IsOptional()
  product_name?: string; // optional, fallback handled in service

  @IsString()
  @IsOptional()
  product_category?: string; // optional

  @IsString()
  @IsOptional()
  product_profile?: string; // optional

  @IsString()
  @IsOptional()
  shipping_method?: string; // optional
}
