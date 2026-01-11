import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class TeacherApprovalService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly mailService: MailerService,
  ) {}

  // Get all pending teachers
  async getPendingTeachers() {
    return this.userRepo.find({
      where: {
        role: { role_name: 'TEACHER' },
        isActive: false,
      },
      relations: ['credential', 'role'],
      order: { created_at: 'DESC' },
    });
  }

  // Approve teacher
  async approveTeacher(userId: number) {
    const user = await this.userRepo.findOne({
      where: { user_id: userId },
      relations: ['credential', 'role'],
    });

    if (!user) {
      throw new NotFoundException('Teacher not found');
    }

    if (user.role.role_name !== 'TEACHER') {
      throw new BadRequestException('Invalid user role');
    }

    if (user.isActive) {
      throw new BadRequestException('Teacher already approved');
    }

    user.isActive = true;
    await this.userRepo.save(user);

    // 📧 approval email
    await this.mailService.sendMail({
      to: user.credential.email,
      subject: 'Teacher Account Approved',
      html: `
        <h3>Hello ${user.full_name},</h3>
        <p>Your teacher account has been <b>approved</b>.</p>
        <p>You can now log in and start creating courses.</p>
        <br/>
        <p>Regards,<br/>EduWave Team</p>
      `,
    });

    return {
      message: 'Teacher approved successfully',
    };
  }


  // Reject teacher
  async rejectTeacher(userId: number) {
    const user = await this.userRepo.findOne({
      where: { user_id: userId },
      relations: ['credential', 'role'],
    });

    if (!user) {
      throw new NotFoundException('Teacher not found');
    }

    if (user.role.role_name !== 'TEACHER') {
      throw new BadRequestException('Invalid user role');
    }

    const email = user.credential.email;
    const name = user.full_name;

    // remove teacher (credential removed via cascade)
    await this.userRepo.remove(user);

    // 📧 rejection email
    await this.mailService.sendMail({
      to: email,
      subject: 'Teacher Account Rejected',
      html: `
        <h3>Hello ${name},</h3>
        <p>Unfortunately, your teacher account request has been <b>rejected</b>.</p>
        <p>You may contact support for further clarification.</p>
        <br/>
        <p>Regards,<br/>EduWave Team</p>
      `,
    });

    return {
      message: 'Teacher rejected and removed successfully',
    };
  }
}
