import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'taxonomies' })
export class Taxonomy {

    @PrimaryGeneratedColumn('uuid')
    id: string;


    @Column('text')
    group: string;


    @Column('text')
    type: string;


    @Column('text')
    code: string;


    @Column('text')
    name: string;


    @Column('text', {
        nullable: true
    })
    icon: string;


    @Column('text', {
        nullable: true
    })
    color: string;


    @OneToOne(
        () => Taxonomy,
        (taxonomy) => taxonomy.childs,
    )
    parent_taxonomy: Taxonomy;


    @OneToMany(
        () => Taxonomy,
        (taxonomy) => taxonomy.parent_taxonomy,
    )
    childs: Taxonomy[];


}
