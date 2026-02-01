import {
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Tag } from './course-tags.entity';

@Entity('course_tag_mapping')
export class CourseTagMapping {
    @PrimaryGeneratedColumn()
    course_tag_mapping_id: number;

    @ManyToOne(() => Course, (course) => course.tagMappings, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @ManyToOne(() => Tag, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tag_id' })
    tag: Tag;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;
}
