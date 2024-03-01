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

    @Column({ type: 'varchar', nullable: true })
    backgroundImage?: string;

    @Column({ type: 'text', nullable: false })
    description!: string;

    @Column({ type: 'text', nullable: false })
    remark!: string;

    @Column({ type: 'jsonb', nullable: false })
    venue!: PointDetails;

    @Column({ type: 'varchar', nullable: true })
    file?: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' }) // Define the many-to-one relationship
    @JoinColumn({ name: 'ownerId' })
    owner!: User;

    @Column({ type: 'int', nullable: false })
    ownerId!: number;
}

export default Event;
