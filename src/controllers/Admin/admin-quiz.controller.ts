import {
  Controller,
  Get,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { AdminQuizService } from 'src/services/Admin/admin-quiz.service';

@Controller('admin/quizzes')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminQuizController {
  constructor(private readonly quizService: AdminQuizService) {}

  @Get()
  getAllQuizzes() {
    return this.quizService.getAllQuizzes();
  }

  @Delete(':id')
  deleteQuiz(@Param('id') id: number) {
    return this.quizService.deleteQuiz(+id);
  }
}
