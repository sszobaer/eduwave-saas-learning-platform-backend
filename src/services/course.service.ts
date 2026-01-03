import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateCourseDto } from "src/dtos/Course/create-course.dto";
import { UpdateCourseDto } from "src/dtos/Course/update-course.dto";
import { CourseTagMapping } from "src/entities/course-tags-mapping";
import { Tag } from "src/entities/course-tags.entity";
import { Course } from "src/entities/course.entity";
import { Repository } from "typeorm";

@Injectable()
export class CourseService {
    constructor(
        @InjectRepository(Course)
        private courseRepo: Repository<Course>,

        @InjectRepository(Tag)
        private tagRepo: Repository<Tag>,

        @InjectRepository(CourseTagMapping)
        private mapRepo: Repository<CourseTagMapping>
    ) { }

    async createCourse(data: CreateCourseDto, userId: number) {
        const course = this.courseRepo.create({
            ...data,
            created_by_user: { user_id: userId }
        });

        const savedCourse = await this.courseRepo.save(course);

        if (data.tag_names && data.tag_names.length > 0) {
            await this.assignTagsByName(savedCourse.course_id, data.tag_names);
        }

        return savedCourse;
    }


    async assignTagsByName(courseId: number, tagNames: string[]) {
        const course = await this.courseRepo.findOne({
            where: { course_id: courseId }
        });

        if (!course) throw new NotFoundException('Course not found');

        await this.mapRepo.delete({ course: { course_id: courseId } });

        const tagIds: number[] = [];

        for (const tagName of tagNames) {
            let tag = await this.tagRepo.findOne({
                where: { tag_name: tagName }
            });

            if (!tag) {
                tag = await this.tagRepo.save(
                    this.tagRepo.create({ tag_name: tagName })
                );
            }

            tagIds.push(tag.tag_id);
        }

        const mappings = tagIds.map(tagId =>
            this.mapRepo.create({
                course: { course_id: courseId },
                tag: { tag_id: tagId }
            })
        );
        return this.mapRepo.save(mappings);
    }

    async getCourse(courseId: number) {
        return this.courseRepo.findOne({
            where: { course_id: courseId },
            relations: ['created_by_user', 'course_tag_map', 'course_tag_map.tag'],
        });
    }

//     async getCourse(courseId: number) {
//   const course = await this.courseRepo.findOne({
//     where: { course_id: courseId },
//     relations: ['lectures'],
//   });

  async getCourseById(courseId: number) {
    const course = await this.courseRepo.findOne({
      where: { course_id: courseId },
      relations: ['lectures', 'created_by_user'],
    });
    if (!course) throw new NotFoundException('Lecture not found');
    return course.lectures;
  }


    async updateCourse(courseId: number, data: UpdateCourseDto, userId: number) {
        const course = await this.courseRepo.findOne({
            where: { course_id: courseId },
            relations: ['created_by_user'],
        });

        if (!course) throw new NotFoundException('Course not found');

        if (course.created_by_user.user_id !== userId)
            throw new ForbiddenException('You are not allowed to update this course');

        Object.assign(course, data);

        const updatedCourse = await this.courseRepo.save(course);

        if (data.tag_names && data.tag_names.length > 0)
            await this.assignTagsByName(courseId, data.tag_names);

        return updatedCourse;
    }

    async deleteCourse(courseId: number, userId: number) {
        const course = await this.courseRepo.findOne({
            where: { course_id: courseId },
            relations: ['created_by_user'],
        });

        if (!course) throw new NotFoundException('Course not found');

        if (course.created_by_user.user_id !== userId)
            throw new ForbiddenException('You cannot delete this course');

        await this.courseRepo.remove(course);

        return { message: 'Course deleted successfully' };
    }
}