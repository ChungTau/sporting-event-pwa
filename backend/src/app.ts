import express, { Application } from 'express';
import sequelize from './config/dbConfig';
import userRoutes from './routes/userRoutes';
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
const PORT = process.env.PORT || 3389;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');

    sequelize.sync();
    
    app.use(express.json());
    app.use(cors());
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use('/api', userRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
