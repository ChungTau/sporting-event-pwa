import { TextDataType } from 'sequelize';
import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

// `@` Annotations一定要擺係用嘅地方上面一行
//Table啫係Model, 但內置包括埋timestamps. E.g. createAt, updateAt
//Column啫係Attribute. E.g. name, email, age, gender

//詳細版
@Table({
    timestamps: true,
    tableName: 'events2'
})
export class Event extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number; // Adding the id field

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
  endDateTime!: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  backgroundImage!: TextDataType;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: TextDataType;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  remark!: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  venue!: JSON;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  file!: TextDataType;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ownerId!: number;
}

export default Event;