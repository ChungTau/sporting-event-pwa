import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './User';

interface PointDetails{
  lng: number;
  lat: number;
  address: string;
  name: string;
}

@Table({
  timestamps: true,
  tableName: 'events2', // Set your table name here
})
class Event extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  type!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  privacy!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  maxOfParti!: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDateTime!: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDateTime?: Date | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  backgroundImage?: string|undefined;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  remark!: string;

  @Column({
    type: DataType.JSONB, // You can use JSONB type for storing JSON data
    allowNull: false,
  })
  venue!: PointDetails;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  file?: string|undefined;

  @ForeignKey(() => User) // Define the foreign key relationship
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ownerId!: number;

  @BelongsTo(() => User) // Define the belongs-to relationship
  owner!: User;

  // Add associations if needed
  // @ForeignKey(() => User)
  // @Column
  // userId: number;

  // @BelongsTo(() => User)
  // user: User;

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
      file,
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
      file,
      ownerId
    };
  }
}

export default Event;
