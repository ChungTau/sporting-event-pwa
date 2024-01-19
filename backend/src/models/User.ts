import { Table, Column, Model, DataType, PrimaryKey, AutoIncrement } from 'sequelize-typescript';

// `@` Annotations一定要擺係用嘅地方上面一行
//Table啫係Model, 但內置包括埋timestamps. E.g. createAt, updateAt
//Column啫係Attribute. E.g. name, email, age, gender

//詳細版
@Table({
  timestamps: true,
  tableName: 'users',
})
class User extends Model {
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
  username!: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING, 
    allowNull: true, 
  })
  gender!: string;

  @Column({
    type: DataType.STRING, 
    allowNull: true, 
  })
  dob!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true, 
  })
  phoneNumber!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true, 
  })
  emergencyPerson!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  emergencyContact!: string;

  toJson() {
    const { id, username, email, gender, dob, phoneNumber, emergencyPerson, emergencyContact } = this;
    return {
      id,
      username,
      email,
      gender,
      dob,
      phoneNumber,
      emergencyPerson,
      emergencyContact,
    };
  }
}

export default User;


//簡化Default版
/**
 * @Table
 * export class User extends Model {
 *  @Column
 *  name!: string;
 * 
 *  @Column
 *  email!: string;
 * }
 */
