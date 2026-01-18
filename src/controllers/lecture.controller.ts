import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GetUser } from 'src/decorators/get-user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { CreateLectureDto } from 'src/dtos/Lecture/create-lecture.dto';
import { UpdateLectureDto } from 'src/dtos/Lecture/update-lecture.dto';
import { LectureService } from 'src/services/lecture.service';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Controller('lectures')
@UseGuards(AuthGuard, RolesGuard)
@Roles('TEACHER')
export class LectureController {
  constructor(private readonly lectureService: LectureService) { }

  @Post(':courseId/create')
  @UseInterceptors(
    FileInterceptor('lecture_video', {
      storage: diskStorage({
        destination: './uploads/lecture-videos',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (file.originalname.match(/\.(mp4|MOV|mov|avi|mkv|webm)$/)) cb(null, true);
        else cb(new BadRequestException('Only video files are allowed!'), false);
      },
      limits: { fileSize: 500 * 1024 * 1024 },
    }),
  )
  async createLecture(
    @UploadedFile() file: Express.Multer.File,
    @Param('courseId') courseId: number,
    @Body() body: any,
    @GetUser() user: any,
  ) {
    const dto = plainToInstance(CreateLectureDto, {
      ...body,
      course_id: courseId,
    });

    await validateOrReject(dto);

    if (!file && !dto.lecture_video) {
      throw new BadRequestException('Video file or video link is required');
    }

    if (file) {
      dto.lecture_video = `/uploads/lecture-videos/${file.filename}`;
    }

    return this.lectureService.createLecture(dto, user.sub);
  }

  @Get()
  getAll(@GetUser() user: any) {
    return this.lectureService.getAllLectures(user.sub);
  }

  @Get(':id')
  getOne(@Param('id') id: number, @GetUser() user: any) {
    return this.lectureService.getLectureById(id, user.sub);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() dto: UpdateLectureDto,
    @GetUser() user: any,
  ) {
    return this.lectureService.updateLecture(id, dto, user.sub);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @GetUser() user: any) {
    return this.lectureService.deleteLecture(id, user.sub);
  }
}
