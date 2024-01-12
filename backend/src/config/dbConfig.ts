import { Sequelize } from 'sequelize-typescript';


const DB = {
  name: 'FYP',
  user: 'root',
  pass: '1234',
  host: 'localhost',
};

const sequelize = new Sequelize(DB.name, DB.user, DB.pass, {
  host: DB.host,
  dialect: 'mysql',
  models: [__dirname + '/../models'],
  logging: console.log,
  port: 3306
});

export default sequelize;
