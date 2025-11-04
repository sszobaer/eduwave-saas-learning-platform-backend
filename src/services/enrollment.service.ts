import { Injectable } from '@nestjs/common'
import { CreateEnrollmentDto } from 'src/dtos/Enrollment/create-enrollment.dto';
// Bussiness Logic
@Injectable()
export class EnrollmentService
{
    getEnrollmentInfo(): string
    {
        return "Name : ABC\nID : xxxxx\nPayment : Bikash";
    }

    getEnrollmentStudentInfoByName(name: string): string
    {
        return `Name : ${name}\nID : xxxxx\nPayment : Bikash`;
    }

    getEnrollmentStudentInfoByID(ID: number,name : string): string
    {
        return `Name : ${name}\nID : ${ID}\nPayment : Bikash`;
    }

    createStudent(student : any)
    {
        return{
            message: "Student Created Successfully",
            student: student
        };
    }

    createStudentUsingDTO(CreateEnrollmentDto : CreateEnrollmentDto): string
    {
        const {name,id} = CreateEnrollmentDto;
        return `Student name is ${name} and ID is ${id}`;
    }
}