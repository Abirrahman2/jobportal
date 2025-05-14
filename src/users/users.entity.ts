import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age:number;

  @Column({unique:true})
  email:string;

  @Column()
  password:string;

  @Column({default:'user'})
  role:string;

  @Column()
  address:string;
  @Column({ default: true })
  isActive: boolean;

}