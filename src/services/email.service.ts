import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendEmailDto } from 'src/dtos/Email/send-email.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailer: MailerService) {}

  async sendEmail(payload: SendEmailDto): Promise<void> {
    const { to, subject, text, html, from } = payload;

    try { 
      await this.mailer.sendMail({
        to,
        subject,
        text,
        html,
        from, 
      });

      this.logger.log(
        `Email sent to ${Array.isArray(to) ? to.join(', ') : to} with subject "${subject}"`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${Array.isArray(to) ? to.join(', ') : to}: ${error.message}`,
        error.stack,
      ); 
    }
  }
}
