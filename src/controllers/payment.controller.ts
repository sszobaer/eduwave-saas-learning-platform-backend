import { Controller, Post, Body, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePaymentDto } from 'src/dtos/Payment/create-payment.dto';
import { PaymentService } from 'src/services/payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createPayment(@Body() dto: CreatePaymentDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.paymentService.createPaymentSession(dto);
  }

  @Post('success')
  handlePaymentSuccess(@Body() paymentData: any) {
    const { tran_id, val_id } = paymentData;

    if (!tran_id || !val_id) {
      throw new HttpException('Missing val_id or tran_id', HttpStatus.BAD_REQUEST);
    }

    console.log('Payment received:', paymentData);

    // TODO: verify payment with SSLCommerz validate API if needed
    // TODO: store payment data in your database

    return { message: 'Payment received successfully' };
  }

  @Get('verify')
  async verifyPayment(@Query('val_id') val_id: string, @Query('tran_id') tran_id: string) {
    return this.paymentService.verifyPayment(val_id, tran_id);
  }
}
