import { User } from "src/auth/entities/user.entity";
import { Taxonomy } from "src/taxonomies/entities/taxonomy.entity";
import {
    Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne,
    OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn
} from "typeorm";

import { Record } from './record.entity'

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
        user => user.tickets_created,
        { eager: true }
    )
    creator: User;

    @ManyToOne(
        () => User,
        user => user.tickets_assigned,
        { eager: true, nullable: true }
    )
    support_rep: User;


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


    @OneToMany(
        () => Record,
        (record) => record.ticket
    )
    records: Record[];

}
