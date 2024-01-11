import express from 'express';
import sequelize from './config/dbConfig';
import userRoutes from './routes/userRoutes';

// Catch unhandled promise rejections
process.on('unhandledRejection', error => {
  console.error('Unhandled Promise Rejection:', error);
});

// Catch uncaught exceptions
process.on('uncaughtException', error => {
  console.error('Uncaught Exception:', error);
});

const app = express();
const PORT = 8080;

sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');

    sequelize.sync();

    app.use(express.json());
    app.use('/api', userRoutes);

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
