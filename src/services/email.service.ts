import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from 'src/dtos/Email/send-email.dto';


import * as nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import { join } from 'path';

@Injectable()
export class EmailService {
  private transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const templatesPath = join(process.cwd(), 'src', 'templates');

    this.transporter.use(
      'compile',
      hbs({
        viewEngine: {
          extname: '.hbs',
          layoutsDir: templatesPath,
          defaultLayout: false,
        },
        viewPath: templatesPath,
        extName: '.hbs',
      }),
    );
  }

  async sendEmail(dto: SendEmailDto): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to: dto.to,
        subject: dto.subject,
        template: dto.template,
        context: dto.context,
      });

      this.logger.log(`Email sent to ${dto.to}`);
    } catch (error) {
      this.logger.error('Email sending failed', error);
      throw error;
    }
  }
}
