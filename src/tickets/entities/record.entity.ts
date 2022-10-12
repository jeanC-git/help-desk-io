import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "src/auth/entities/user.entity";
import { Ticket } from "./ticket.entity";



@Entity({ name: 'records' })
export class Record {


    @PrimaryGeneratedColumn('uuid')
    id: string;


    @ManyToOne(
        () => Ticket,
        (ticket) => ticket.records,
    )
    ticket: Ticket;


    @ManyToOne(
        () => User,
        (user) => user.ticket_records
    )
    creator: User;


    @Column('text')
    title: string;


    @Column('text')
    body: string;


    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;


    @DeleteDateColumn({
        select: false
    })
    deletedAt: Date;
}