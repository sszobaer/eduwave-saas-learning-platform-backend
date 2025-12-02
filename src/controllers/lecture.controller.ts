import {Body, Controller, Post, Put, Get, Param, Delete, UploadedFile, UseGuards, UseInterceptors, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { GetUser } from 'src/decorators/get-user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { CreateLectureDto } from 'src/dtos/Lecture/create-lecture.dto';
import { UpdateLectureDto } from 'src/dtos/Lecture/update-lecture.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { LectureService } from 'src/services/lecture.service';

@Controller('lectures')
@UseGuards(AuthGuard, RolesGuard)
@Roles('teacher')
export class LectureController {
    constructor(private readonly lectureService: LectureService) { }


    @Post('create')
    @UseInterceptors(
        FileInterceptor('video', {
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
        @Body() dto: CreateLectureDto,
        @GetUser() user: any,
    ) {
        if (!file && !dto.video_link) {
            throw new BadRequestException('Video file or video link is required');
        }

        if (file) {
            dto.video_link = `/uploads/lecture-videos/${file.filename}`;
        }

        return this.lectureService.createLecture(dto, user.sub);
    }

    @Put('update/:id')
    @UseInterceptors(
        FileInterceptor('video', {
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
        @UploadedFile() file: Express.Multer.File,
        @Body() dto: UpdateLectureDto,
    ) {
        if (file)
            dto.video_link = `/uploads/lecture-videos/${file.filename}`;

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
