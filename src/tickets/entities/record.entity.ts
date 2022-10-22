import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { User } from "src/auth/entities/user.entity";
import { Ticket } from "./ticket.entity";
import { Taxonomy } from "src/taxonomies/entities/taxonomy.entity";



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
        (user) => user.ticket_records,
        { nullable: true }
    )
    creator: User;


    @Column('text')
    title: string;


    @Column('text')
    body: string;

    @ManyToOne(
        () => Taxonomy,
        () => { },
        { nullable: false }
    )
    type: Taxonomy;


    @CreateDateColumn({
        type: 'timestamptz'
    })
    createdAt: Date;


    @UpdateDateColumn({
        type: 'timestamptz'
    })
    updatedAt: Date;


    @DeleteDateColumn({
        type: 'timestamptz',
        select: false
    })
    deletedAt: Date;
}