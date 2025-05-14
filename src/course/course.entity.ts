import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column()
  level: string;

  @Column()
  language: string;

  @Column()
  duration: string;

  @Column({nullable:true})
  link: string; 

  @Column({default:'not published'})
  status: string;
  @Column({nullable:true})
  price:number;
  @Column()
  createdDate: Date;

}