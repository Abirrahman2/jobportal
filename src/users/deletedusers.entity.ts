import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class DeleteUser{
    @PrimaryGeneratedColumn()
    id:number;
    @Column({nullable:true})
    userId:number;
    @Column()
    firstName:string;
    @Column()
    lastName:string;
    @Column()
    age:number;
    @Column()
    email:string;
    @Column()
    role:string;
    @Column()
    address:string;
    @Column({nullable:true})
    deletedTime:Date;
}