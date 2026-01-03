import {Body, Controller, Post, Put, Get, Param, Delete, UploadedFile, UseGuards, UseInterceptors, BadRequestException, ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { log } from 'console';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GetUser } from 'src/decorators/get-user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateLectureDto } from 'src/dtos/Lecture/create-lecture.dto';
import { UpdateLectureDto } from 'src/dtos/Lecture/update-lecture.dto';
import { Course } from 'src/entities/course.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { LectureService } from 'src/services/lecture.service';
import { Int32 } from 'typeorm';

@Controller('lectures')
@UseGuards(AuthGuard, RolesGuard)
@Roles('teacher')
export class LectureController {
    constructor(private readonly lectureService: LectureService) { }

    // @Post('quizzes/:quizId/questions')
    //   createForQuiz(
    //     @Param('quizId', ParseIntPipe) quizId: number,
    //     @Body() createQuestionDto: CreateQuestionDto,
    //   ) {
        
    //     createQuestionDto.quizId = quizId;
    //     return this.questionsService.create(createQuestionDto);
    //   }

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
                if (file.originalname.match(/\.(mp4|mov|avi|mkv|webm)$/)) cb(null, true);
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

    @Put(':courseId/update/:id')
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
                if (file.originalname.match(/\.(mp4|mov|avi|mkv)$/)) cb(null, true);
                else cb(new BadRequestException('Only video files are allowed!'), false);
            },
            limits: { fileSize: 500 * 1024 * 1024 },
        }),
    )
    async updateLecture(
        @Param('id') id: number,
        @Param('courseId') courseId: number,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
    ) {
        const dto = plainToInstance(UpdateLectureDto, {
        ...body,
        course_id: courseId, 
    });

    await validateOrReject(dto);
        if (file)
            dto.lecture_video = `/uploads/lecture-videos/${file.filename}`;

        return this.lectureService.updateLecture(id, dto);
    }

    @Get('getall')
    async getAllLectures() {
        return this.lectureService.getAllLectures();
    }

    @Get('get/:id')
    async getLectureById(@Param('id') id: number) {
        return this.lectureService.getLectureById(id);
    }

    @Delete('delete/:id')
    async deleteLecture(@Param('id') id: number) {
        return this.lectureService.deleteLecture(id);
    }
}
