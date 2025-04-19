import express from 'express';
import cors from 'cors';
import questionRoutes from './routes/questions';
import userRoutes from './routes/users';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/questions', questionRoutes);
app.use('/users', userRoutes);

app.get('/health', (_req, res) => res.send('OK'));

app.listen(3001, () => console.log('Server running on http://localhost:3001')); 