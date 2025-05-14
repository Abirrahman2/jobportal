import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Purchase{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({nullable:true})
    userId:number;

    @Column({nullable:true})
    courseId:number;

    @Column({nullable:true})
    sessionId:string;

    @Column({ type: "varchar", nullable: true })
    status: string|null;

    @Column('numeric')
    amount:number;

    @Column({nullable:true})
    currency:string;
    
    @CreateDateColumn({nullable:true})
    createdAt:Date;

}