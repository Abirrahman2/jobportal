import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name:string;
  @Column()
  companyType:string;
  @Column()
  tinNumber:string;
  @Column()
  email:string;
  @Column()
  address:string;
  @Column({nullable:true})
  website:string;
  @Column()
  status:string;

  


}