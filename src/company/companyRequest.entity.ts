import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CompanyRequest {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  recId:number;
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
  @Column({default:'pending'})
  status:string;

  


}