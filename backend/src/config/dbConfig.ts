import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'postgres', // instead of '127.0.0.1'
    port: 5432,
    username: 'fyp',
    password: 'FYP_gib5',
    database: 'FYP',
    entities: [
        __dirname + '/../models/*.ts' // adjust this path as necessary
    ],
    synchronize: true, // Note: only use this in development
    logging: false,
});

export const JWT_SECRET = 'gib5';