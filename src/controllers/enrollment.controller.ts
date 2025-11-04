import { Controller,Get,Post,Param,Query,Body, ParseIntPipe} from '@nestjs/common'
import { CreateEnrollmentDto } from 'src/dtos/Enrollment/create-enrollment.dto';
import { EnrollmentService } from 'src/services/enrollment.service';


// Incoming Request and returning response
// get,post,put,delete,patch 

@Controller('enrollment')
export class EnrollmentController
{
    // Dependency Injection
    constructor(private readonly enrollmentService : EnrollmentService){}

    @Get('studentinfo')
    getEnrollmentInfo(): string
    {
        return this.enrollmentService.getEnrollmentInfo();
    }

    @Get('student/:name')
    getEnrollmentStudentInfoByName(@Param('name') name: string): string
    {
        return this.enrollmentService.getEnrollmentStudentInfoByName(name);
    }

    //localhost:7000/enrollment/student?id=22&name=Sazzad
    @Get('student')
    getEnrollmentStudentInfoByID(@Query('id') id:  number,@Query('name')name: string): string
    {
        return this.enrollmentService.getEnrollmentStudentInfoByID(id,name);
    }

    @Post('create')
    createStudent(@Body() body: any) 
    {
        return this.enrollmentService.createStudent(body);
    }

     @Post('studentdto')
    createStudentUsingDTO(@Body() CreateStudentDto: CreateEnrollmentDto) {
    return this.enrollmentService.createStudentUsingDTO(CreateStudentDto);
    }
}
