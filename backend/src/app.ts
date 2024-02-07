import express, { Application } from 'express';
import sequelize from './config/dbConfig';
import userRoutes from './routes/userRoutes';
import eventRoutes from './routes/eventRoutes';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

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
const PORT: number =  8081;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');

    sequelize.sync();
    
    app.use(express.json({limit: '50mb'}));
    app.use(express.urlencoded({ extended: false }));
    app.use(cors({
      origin: '*', // Set the origin to allow all origins
    }));
    app.use('/api/ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use('/api/users', userRoutes);
    app.use('/api/events', eventRoutes)

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(swaggerSpec);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
