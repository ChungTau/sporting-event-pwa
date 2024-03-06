import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import User from './User';
import Plan from './Plan'; // Import the Plan entity

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

    @Column({ type: 'text', nullable: true })
    backgroundImage?: string|undefined;

    @Column({ type: 'text', nullable: false })
    description!: string;

    @Column({ type: 'text', nullable: false })
    remark!: string;

    @Column({ type: 'jsonb', nullable: false })
    venue!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'ownerId' })
    owner!: User|null;

    @Column({ type: 'int', nullable: false })
    ownerId!: number;

    @ManyToOne(() => Plan, plan => plan.events) // Define the many-to-one relationship
    @JoinColumn({ name: 'planId' })
    plan!: Plan|null; // The plan associated with this event

    @Column({ type: 'int', nullable: true })
    planId?: number; // Nullable as it's optional

    toJson() {
        const {
          id,
          name,
          type,
          privacy,
          maxOfParti,
          startDateTime,
          endDateTime,
          backgroundImage,
          description,
          remark,
          venue,
          planId,
          ownerId
        } = this;
        return {
          id,
          name,
          type,
          privacy,
          maxOfParti,
          startDateTime,
          endDateTime,
          backgroundImage,
          description,
          remark,
          venue,
          planId,
          ownerId
        };
      }
    }
    

export default Event;
