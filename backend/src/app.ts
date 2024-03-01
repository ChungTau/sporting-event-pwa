import express, { Application } from 'express';
import { AppDataSource } from './config/dbConfig';
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from "./swagger_output.json";

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
const PORT: number =  8080;

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');

        app.use(express.json());
        app.use(cors({
            origin: '*', // Set the origin to allow all origins
        }));
        app.use('/api/ui', swaggerUi.serve, swaggerUi.setup(swaggerOutput));
        app.use('/api/users', userRoutes);
        
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => console.error('Error during Data Source initialization:', error));