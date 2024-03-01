import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import User from './User';

interface PointDetails {
    lng: number;
    lat: number;
    address: string;
    name: string;
}

@Entity({ name: 'events' })
class Event {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', nullable: false })
    name!: string;

    @Column({ type: 'varchar', nullable: false })
    type!: string;

    @Column({ type: 'varchar', nullable: false })
    privacy!: string;

    @Column({ type: 'int', nullable: false })
    maxOfParti!: number;

    @Column({ type: 'timestamp', nullable: false })
    startDateTime!: Date;

    @Column({ type: 'timestamp', nullable: true })
    endDateTime?: Date;

    @Column({ type: 'bytea', nullable: true }) // Change type to 'bytea' for PostgreSQL
    backgroundImage?: Buffer; // Change type to Buffer for binary data

    @Column({ type: 'text', nullable: false })
    description!: string;

    @Column({ type: 'text', nullable: false })
    remark!: string;

    @Column({ type: 'jsonb', nullable: false })
    venue!: PointDetails;

    @Column({ type: 'bytea', nullable: true }) // Change type to 'bytea' for PostgreSQL
    gpxFile?: Buffer; // Change type to Buffer for binary data

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ownerId' })
    owner!: User;

    @Column({ type: 'int', nullable: false })
    ownerId!: number;
}

export default Event;
