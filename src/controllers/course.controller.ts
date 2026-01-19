import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage, MulterError } from "multer";
import { GetUser } from "src/decorators/get-user.decorator";
import { Roles } from "src/decorators/roles.decorator";
import { CreateCourseDto } from "src/dtos/Course/create-course.dto";
import { UpdateCourseDto } from "src/dtos/Course/update-course.dto";
import { AuthGuard } from "src/guards/auth.guard";
import { RolesGuard } from "src/guards/role.guard";
import { CourseService } from "src/services/course.service";

@Controller('courses')
export class CourseController {
    constructor(private readonly courseService: CourseService) { }

    @Get("all")
    async getAllCourses() {
        return await this.courseService.getAllCourses();
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('TEACHER', 'ADMIN')
    @Post('create')
    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileInterceptor('thumbnail_url', {
            fileFilter: (req, file, cb) => {
                if (file.originalname.match(/^.*\.(JPG|jpg|jpeg|png|webp)$/)) cb(null, true);
                else cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'thumbnail_url'), false);
            },
            limits: { fileSize: 2 * 1024 * 1024 },
            storage: diskStorage({
                destination: './uploads/course-thumbnails',
                filename: (req, file, cb) => {
                    cb(null, Date.now() + '-' + file.originalname);
                },
            }),
        }),
    )
    createCourse(
        @UploadedFile() file: Express.Multer.File,
        @GetUser() user: any,
        @Body() data: CreateCourseDto,
    ) {
        if (!file) throw new BadRequestException('Thumbnail image is required');

        data.thumbnail_url = `/uploads/course-thumbnails/${file.filename}`;
        console.log(user);
        return this.courseService.createCourse(data, user.sub);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('TEACHER', 'ADMIN')
    @Get("indivisual")
    async getAllCoursesByIndivisualUser(@GetUser() user: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return await this.courseService.getAllCoursesByIndivisualUser(user.sub);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('TEACHER', 'ADMIN')
    @Patch('update/:id')
    @UseInterceptors(
        FileInterceptor('thumbnail', {
            fileFilter: (req, file, cb) => {
                if (file.originalname.match(/^.*\.(jpg|jpeg|png|webp)$/)) cb(null, true);
                else cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'thumbnail'), false);
            },
            limits: { fileSize: 3 * 1024 * 1024 },
            storage: diskStorage({
                destination: './uploads/course-thumbnails',
                filename: (req, file, cb) => {
                    cb(null, Date.now() + '-' + file.originalname);
                },
            }),
        }),
    )
    async updateCourse(
        @Param('id') id: number,
        @UploadedFile() file: Express.Multer.File,
        @Body() data: UpdateCourseDto,
        @GetUser() user: any,
    ) {
        if (file) {
            data.thumbnail_url = `/uploads/course-thumbnails/${file.filename}`;
        }

        return this.courseService.updateCourse(id, data, user.sub);
    }
    @UseGuards(AuthGuard, RolesGuard)
    @Roles('TEACHER', 'ADMIN')

    @Get(':id')
    async getCourseByIdandUser(@Param('id') id: number, @GetUser() user: any) {
        return this.courseService.getCourse(id, user.sub);
    }

    @Get('details/:id')
    async getCourseById(@Param('id') id: number) {
        return this.courseService.getCourseById(id);
    }

    

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('TEACHER', 'ADMIN')
    @Delete('delete/:id')
    deleteCourse(
        @Param('id') id: number,
        @GetUser() user: any,
    ) {
        return this.courseService.deleteCourseByCreator(Number(id), user.sub);
    }

}