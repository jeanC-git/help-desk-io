import * as bcrypt from 'bcrypt';

interface SeedProduct {
    description: string;
    images: string[];
    stock: number;
    price: number;
    sizes: ValidSizes[];
    slug: string;
    tags: string[];
    title: string;
    type: ValidTypes;
    gender: GenderOptions;
}

interface SeedUser {
    email: string;
    document: string;
    password: string;
    name: string;
    surname: string;
    lastname: string;
    roles: string[];
}

interface SeedTaxonomy {
    group: string;
    type: string;
    code: string;
    name: string;
    icon?: string;
    color?: string;
}

type ValidSizes = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';
type ValidTypes = 'shirts' | 'pants' | 'hoodies' | 'hats';
type GenderOptions = 'men' | 'women' | 'kid' | 'unisex';


interface SeedData {
    users: SeedUser[];
    taxonomies: SeedTaxonomy[];
}


export const initialData: SeedData = {

    users: [
        {
            email: 'customer1@example.com',
            document: '11111111',
            name: 'Customer 1',
            surname: '',
            lastname: '',
            password: bcrypt.hashSync('Abc123', 10),
            roles: ['customer'],
        },
        {
            email: 'customer2@example.com',
            document: '22222222',
            name: 'Customer 2',
            surname: '',
            lastname: '',
            password: bcrypt.hashSync('Abc123', 10),
            roles: ['customer'],
        },
        {
            email: 'support1@example.com',
            document: '33333333',
            name: 'Support 1',
            surname: '',
            lastname: '',
            password: bcrypt.hashSync('Abc123', 10),
            roles: ['support-rep'],
        },
        {
            email: 'support2@example.com',
            document: '44444444',
            name: 'Support 2',
            surname: '',
            lastname: '',
            password: bcrypt.hashSync('Abc123', 10),
            roles: ['support-rep'],
        },
    ],


    taxonomies: [
        {
            group: 'ticket',
            type: 'status',
            code: 'pending',
            name: 'Pending',
        },
        {
            group: 'ticket',
            type: 'status',
            code: 'opened',
            name: 'Opened',
        },
        {
            group: 'ticket',
            type: 'status',
            code: 'assigned',
            name: 'Assigned',
        },
        {
            group: 'ticket',
            type: 'status',
            code: 'in-progress',
            name: 'In progress',
        },
        {
            group: 'ticket',
            type: 'status',
            code: 'on-hold',
            name: 'On hold',
        },
        {
            group: 'ticket',
            type: 'status',
            code: 'resolved',
            name: 'Resolved',
        },
        {
            group: 'ticket',
            type: 'status',
            code: 'closed',
            name: 'Closed',
        },
        {
            group: 'ticket',
            type: 'status',
            code: 'canceled',
            name: 'Canceled',
        },
        {
            group: 'ticket',
            type: 'type',
            code: 'user-request',
            name: 'User request',
        },
        {
            group: 'record',
            type: 'type',
            code: 'status-history',
            name: 'Status history',
        },
        {
            group: 'record',
            type: 'type',
            code: 'assignment-history',
            name: 'Assignment history',
        },
        {
            group: 'record',
            type: 'type',
            code: 'system-history',
            name: 'System history',
        },
        {
            group: 'record',
            type: 'type',
            code: 'customer-response',
            name: 'Customer response',
        },
        {
            group: 'record',
            type: 'type',
            code: 'support-rep-response',
            name: 'Help rep response',
        },
    ]
}