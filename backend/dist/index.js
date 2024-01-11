"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import sequelize from './config/dbConfig';
//import userRoutes from './routes/userRoutes';
const dotenv_1 = __importDefault(require("dotenv"));
//For env File 
dotenv_1.default.config();
// Catch unhandled promise rejections
process.on('unhandledRejection', error => {
    console.error('Unhandled Promise Rejection:', error);
});
// Catch uncaught exceptions
process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
});
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
/*sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');

    sequelize.sync();

    app.use(express.json());
    app.use('/api', userRoutes);

    
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
*/ 
