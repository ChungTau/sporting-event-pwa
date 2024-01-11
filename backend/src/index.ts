import express, { Application } from 'express';
//import sequelize from './config/dbConfig';
//import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';

//For env File 
dotenv.config();
// Catch unhandled promise rejections
process.on('unhandledRejection', error => {
  console.error('Unhandled Promise Rejection:', error);
});

// Catch uncaught exceptions
process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
});

const app: Application = express();
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