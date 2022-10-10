import { Product } from "../../products/entities";
import {
    BeforeInsert, BeforeUpdate, Column,
    Entity, OneToMany, PrimaryGeneratedColumn
} from "typeorm";


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

    // @OneToMany(
    //     () => Product,
    //     ( product ) => product.user
    // )
    // product: Product;

    getFullName(){
        return `${this.name}, ${this.lastname} ${this.surname}`;
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
