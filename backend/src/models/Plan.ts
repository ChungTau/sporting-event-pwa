import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import User from './User';

interface Info {
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

    @Column({ type: 'varchar', nullable: false })
    path!: string;

    @Column({ type: 'varchar', nullable: false })
    thumbnail!: string;

    @Column({ type: 'json', nullable: false })
    info!: Info;

    @ManyToOne(() => User, { onDelete: 'CASCADE' }) // Define the many-to-one relationship
    @JoinColumn({ name: 'ownerId' })
    owner!: User;

    @Column({ type: 'int', nullable: false })
    ownerId!: number;
}

export default Plan;
