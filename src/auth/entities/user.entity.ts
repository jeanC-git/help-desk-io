import {
    BeforeInsert, BeforeUpdate, Column,
    Entity, OneToMany, PrimaryGeneratedColumn
} from "typeorm";

import { Ticket } from "src/tickets/entities/ticket.entity";
import { Expose } from "class-transformer";
import { Record } from "src/tickets/entities/record.entity";


@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    email: string;


    @Column('text', {
        unique: true
    })
    document: string;


    @Column('text', {
        select: false
    })
    password: string;

    @Column('text')
    name: string;

    @Column('text')
    surname: string;

    @Column('text')
    lastname: string;

    @Column('bool', {
        default: true
    })
    active: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @OneToMany(
        () => Ticket,
        (ticket) => ticket.creator
    )
    tickets_created: Ticket[];


    @OneToMany(
        () => Ticket,
        (ticket) => ticket.support_rep
    )
    tickets_assigned: Ticket[];


    @OneToMany(
        () => Record,
        (record) => record.creator
    )
    ticket_records: Record[];

    // @OneToMany(
    //     () => Product,
    //     ( product ) => product.user
    // )
    // product: Product;

    @Expose()
    get fullName(): string {
        return `${this.name}, ${this.surname} ${this.lastname}`;
    }


    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }

}
