"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const DB = {
    name: 'FYP',
    user: 'root',
    pass: '1234',
    host: 'localhost',
};
exports.JWT_SECRET = 'gib5';
const sequelize = new sequelize_typescript_1.Sequelize(DB.name, DB.user, DB.pass, {
    host: DB.host,
    dialect: 'mysql',
    models: [__dirname + '/../models'],
    logging: console.log,
    port: 3306
});
exports.default = sequelize;
