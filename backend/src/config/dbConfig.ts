import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize('FYP', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
  models: [__dirname + '/../models'],
  logging: console.log,
  port: 3306
});

export default sequelize;
