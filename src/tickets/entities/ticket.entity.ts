import { Transform } from "class-transformer";
import { User } from "src/auth/entities/user.entity";
import { Taxonomy } from "src/taxonomies/entities/taxonomy.entity";
import {
    Column, CreateDateColumn, DeleteDateColumn, Entity, Generated, ManyToOne,
    OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

import { Record } from './record.entity'

export const GROUP_SEARCH_ALL_TICKETS = 'search_all_tickets';

@Entity({ name: 'tickets' })
export class Ticket {

    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column('text')
    title: string;


    @Column('text')
    body: string;


    @ManyToOne(
        () => User,
        user => user.tickets,
        { eager: true }
    )
    creator: User;


    @Column({
        type: 'timestamp',
        nullable: true,
    })
    resolvedAt: Date;


    @Column({
        type: 'timestamp',
        nullable: true,
    })
    closedAt: Date;


    @Column({
        type: 'timestamp',
        nullable: true,
    })
    finishedAt: Date;


    @ManyToOne(
        () => Taxonomy,
        () => { },
        { nullable: false }
    )
    status: Taxonomy;


    @ManyToOne(
        () => Taxonomy,
        () => { },
        { nullable: false }
    )
    type: Taxonomy;

    @OneToOne(
        () => Ticket,
        (ticket) => ticket.childs,
    )
    parent_ticket: Ticket;


    @OneToMany(
        () => Ticket,
        (ticket) => ticket.parent_ticket,
    )
    childs: Ticket[];


    @CreateDateColumn()
    createdAt: Date;


    @UpdateDateColumn()
    updatedAt: Date;


    @DeleteDateColumn({
        select: false
    })
    deletedAt: Date;


    @OneToMany(
        () => Record,
        (record) => record.ticket
    )
    records: Record[];

}
