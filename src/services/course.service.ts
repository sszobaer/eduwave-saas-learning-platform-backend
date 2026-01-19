import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from 'src/entities/course.entity';
import { Tag } from 'src/entities/course-tags.entity';
import { CourseTagMapping } from 'src/entities/course-tags-mapping';
import { CreateCourseDto } from 'src/dtos/Course/create-course.dto';
import { UpdateCourseDto } from 'src/dtos/Course/update-course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,

    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,

    @InjectRepository(CourseTagMapping)
    private readonly mapRepo: Repository<CourseTagMapping>,
  ) {}


  async createCourse(dto: CreateCourseDto, userId: number) {
    const course = this.courseRepo.create({
      ...dto,
      created_by_user: { user_id: userId },
    });

    const savedCourse = await this.courseRepo.save(course);

    if (dto.tag_names?.length) {
      await this.assignTags(savedCourse.course_id, dto.tag_names);
    }

    return savedCourse;
  }

  private async assignTags(courseId: number, tagNames: string[]) {
    await this.mapRepo.delete({ course: { course_id: courseId } });

    for (const name of tagNames) {
      let tag = await this.tagRepo.findOne({ where: { tag_name: name } });

      if (!tag) {
        tag = await this.tagRepo.save(
          this.tagRepo.create({ tag_name: name }),
        );
      }

      await this.mapRepo.save(
        this.mapRepo.create({
          course: { course_id: courseId },
          tag: { tag_id: tag.tag_id },
        }),
      );
    }
  }

  async getCourse(courseId: number, userId: number) {
    const course = await this.courseRepo.findOne({
      where: {
        course_id: courseId,
        created_by_user: { user_id: userId },
      },
      relations: ['created_by_user', 'lectures'],
    });

    if (!course) {
      throw new NotFoundException('Course not found or access denied');
    }

    return course;
  }

  async getCourseById(courseId: number) {
    const course = await this.courseRepo.findOne({
      where: {
        course_id: courseId
      },
      relations: {
      created_by_user: true,
      lectures: true,
      tagMappings: {
        tag: true,
      }
    },
    });

    if (!course) {
      throw new NotFoundException('Course not found or access denied');
    }

    return course;
  }

  async getAllCoursesByIndivisualUser(userId: number){
    const course = await this.courseRepo.find({
      where: {
        created_by_user: { user_id: userId },
      },
      relations: ['created_by_user', 'lectures', 'tagMappings',        // Include tagMappings
      'tagMappings.tag'],
    });

    if (!course) {
      throw new NotFoundException('Course not found or access denied');
    }

    return course.map(course => ({
    ...course,
    tags: course.tagMappings?.map(mapping => mapping.tag?.tag_name) || [],
  }));
}
async getAllCourses(){
    const course = await this.courseRepo.find({
     relations: {
      created_by_user: true,
      lectures: true,
      tagMappings: {
        tag: true,
      },
    },
      order: { course_id: 'DESC' },
    });

    if (!course) {
      throw new NotFoundException('Course not found or access denied');
    }
    return course.map(course => ({
    course_id: course.course_id,
    title: course.title,
    description: course.description,
    price: course.price,
    thumbnail_url: course.thumbnail_url,
    created_by_user: {
      full_name: course.created_by_user.full_name,
    },
    tags: course.tagMappings.map(m => m.tag.tag_name),
  }));
}


  async updateCourse(
    courseId: number,
    dto: UpdateCourseDto,
    userId: number,
  ) {
    const course = await this.courseRepo.findOne({
      where: {
        course_id: courseId,
        created_by_user: { user_id: userId },
      },
    });

    if (!course) {
      throw new ForbiddenException('You cannot update this course');
    }

    Object.assign(course, dto);
    const updated = await this.courseRepo.save(course);

    if (dto.tag_names?.length) {
      await this.assignTags(courseId, dto.tag_names);
    }

    return updated;
  }

  async deleteCourseByCreator(courseId: number, userId: number) {
    const course = await this.courseRepo.findOne({
      where: {
        course_id: courseId,
        created_by_user: { user_id: userId },
      },
    });

    if (!course) {
      throw new ForbiddenException('You cannot delete this course');
    }

    await this.courseRepo.remove(course);
    return { message: 'Course deleted successfully' };
  }

}
