import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

// `@` Annotations一定要擺係用嘅地方上面一行
//Table啫係Model, 但內置包括埋timestamps. E.g. createAt, updateAt
//Column啫係Attribute. E.g. name, email, age, gender

//詳細版
@Table({
    timestamps: true,
    tableName: 'events'
})
export class Event extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string; // Adding the id field

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  eventType!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  privacy!: string;
  
  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  password!: string;

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
  endDateTime!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  backgroundImage!: string;

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
    type: DataType.JSON,
    allowNull: false,
  })
  geoData!: JSON;
}

export default Event;