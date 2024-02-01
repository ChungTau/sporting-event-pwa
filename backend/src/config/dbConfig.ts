import { Sequelize } from 'sequelize-typescript';

const DB = {
  name: 'FYP',
  user: 'fyp',
  pass: 'FYP_gib5',
  host: '127.0.0.1',
};

export const JWT_SECRET = 'gib5';

const sequelize = new Sequelize(DB.name, DB.user, DB.pass, {
  host: DB.host,
  dialect: 'mysql',
  models: [__dirname + '/../models'],
  logging: console.log,
  port: 3366
});

export default sequelize;
