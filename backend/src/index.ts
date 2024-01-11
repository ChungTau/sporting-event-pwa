import express from 'express';
import sequelize from './config/dbConfig';
import userRoutes from './routes/userRoutes';

const app = express();
const PORT = 8080;

sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Unable to connect to the database:', err));

sequelize.sync();

app.use(express.json());
app.use('/api', userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});