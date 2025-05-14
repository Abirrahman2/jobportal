import { Entity ,Column,PrimaryGeneratedColumn,ManyToOne,JoinColumn} from "typeorm";
import { Course } from "./course.entity";
import { User } from "src/users/users.entity";
@Entity()
export class CourseUserInfo{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  courseId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  purchaseTime: Date;

  @Column({default:'pending'})
  status: string; 

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;
}
