// src/payment/payment.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import qs from 'qs';
import { Payment } from 'src/entities/payment.entity';
import { User } from 'src/entities/user.entity';
import { Course } from 'src/entities/course.entity';
import { CreatePaymentDto } from 'src/dtos/Payment/create-payment.dto';

@Injectable()
export class PaymentService {
  private storeId = process.env.SSLC_STORE_ID;
  private storePassword = process.env.SSLC_STORE_PASSWORD;
  private sandboxUrl = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  /** Create payment session and return GatewayPageURL */
  async createPaymentSession(dto: CreatePaymentDto) {
    // Generate unique transaction ID
    const tran_id = `TID${Date.now()}`;

    // Prepare SSLCommerz payload
    const postData = {
      store_id: this.storeId,
      store_passwd: this.storePassword,
      total_amount: dto.amount,
      currency: 'BDT',
      tran_id,
      success_url: `http://localhost:3000/payment/success`,
      fail_url: `http://localhost:3000/payment/fail`,
      cancel_url: `http://localhost:3000/payment/cancel`,
      emi_option: 0,
      cus_name: dto.cus_name,
      cus_email: dto.cus_email,
      cus_add1: dto.cus_add1,
      cus_city: dto.cus_city,
      cus_country: dto.cus_country,
      cus_phone: dto.cus_phone,
      product_name: dto.product_name || `Course-${dto.courseId}`,
      product_category: dto.product_category || 'Online Course',
      product_profile: dto.product_profile || 'general',
      shipping_method: dto.shipping_method || 'NO', // Always provide shipping_method
    };

    // Send request to SSLCommerz (form-urlencoded)
    let response;
    try {
      response = await axios.post(this.sandboxUrl, qs.stringify(postData), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
    } catch (err) {
      console.error('SSLCommerz request error:', err.response?.data || err.message);
      throw new BadRequestException('Failed to create payment session');
    }

    // Debug SSLCommerz response
    console.log('SSLCommerz response:', response.data);

    if (!response.data || !response.data.GatewayPageURL) {
      throw new BadRequestException(
        `Failed to create payment session: ${JSON.stringify(response.data)}`,
      );
    }

    // Fetch student and course for FK relation
    const student = await this.userRepository.findOne({ where: { user_id: dto.userId } });
    const course = await this.courseRepository.findOne({ where: { course_id: dto.courseId } });
    if (!student || !course) throw new BadRequestException('Invalid user or course');

    // Save initial payment as Pending
    const payment = this.paymentRepository.create({
      transaction_id: tran_id,
      amount: dto.amount,
      payment_status: 'Pending',
      student,
      course,
    });
    await this.paymentRepository.save(payment);

    // Return GatewayPageURL to frontend
    return response.data.GatewayPageURL;
  }

  /** Verify payment from SSLCommerz callback */
  async verifyPayment(val_id: string, tran_id: string) {
    if (!val_id || !tran_id) throw new BadRequestException('Missing val_id or tran_id');

    const verifyUrl = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${this.storeId}&store_passwd=${this.storePassword}&v=1&format=json`;

    let response;
    try {
      response = await axios.get(verifyUrl);
    } catch (err) {
      console.error('SSLCommerz verification error:', err.response?.data || err.message);
      throw new BadRequestException('Failed to verify payment');
    }

    const payment = await this.paymentRepository.findOne({ where: { transaction_id: tran_id } });
    if (!payment) throw new BadRequestException('Payment not found');

    // Update payment status
    payment.payment_status = response.data.status || 'Failed';
    await this.paymentRepository.save(payment);

    return payment;
  }
}
