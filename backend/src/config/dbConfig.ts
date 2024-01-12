import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASS!, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  models: [__dirname + '/../models'],
  logging: console.log,
  port: 3306
});

export default sequelize;
