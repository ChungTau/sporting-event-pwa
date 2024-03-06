import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import User from './User';
import Event from './Event'; // Import the Event entity

export interface Info {
    distance: number;
    climb: number;
    fall: number;
    max: number;
    min: number;
}

@Entity({ name: 'plans' })
class Plan {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', nullable: false })
    name!: string;

    @Column({ type: 'bytea', nullable: false }) // Change type to 'bytea' for PostgreSQL, or 'BLOB' for other databases
    gpxFile!: Buffer;

    @Column({ type: 'varchar', nullable: false })
    thumbnail!: string;

    @Column({ type: 'json', nullable: false })
    info!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ownerId' })
    owner!: User|null;

    @Column({ type: 'int', nullable: false })
    ownerId!: number;

    @OneToMany(() => Event, event => event.plan, { cascade: true }) // Add cascade option
    events!: Event[];  // Array of events associated with this plan
}

export default Plan;
