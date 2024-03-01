import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' }) // Specifies the table name
class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: false })
  username!: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email!: string;

  @Column({ type: 'varchar', nullable: false })
  password!: string;

  @Column({ type: 'varchar', nullable: true })
  gender!: string;

  @Column({ type: 'varchar', nullable: true })
  dob!: string; // Consider using 'date' type if this is a date field

  @Column({ type: 'varchar', nullable: true })
  phoneNumber!: string;

  @Column({ type: 'varchar', nullable: true })
  emergencyPerson!: string;

  @Column({ type: 'varchar', nullable: true })
  emergencyContact!: string;

  toJson() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      gender: this.gender,
      dob: this.dob,
      phoneNumber: this.phoneNumber,
      emergencyPerson: this.emergencyPerson,
      emergencyContact: this.emergencyContact,
    };
  }
}

export default User;
