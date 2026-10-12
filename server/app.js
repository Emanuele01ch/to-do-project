import express from 'express';
import cors from 'cors';
import todosRouter from './routes/todos.js';
import authRouter from './routes/auth.js';
import habitRoutes from './routes/habits.js';
import dailyRoutes from './routes/dailies.js';

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use('/api/auth', authRouter);

app.use('/api/todos', todosRouter);
app.use('/api/habits', habitRoutes);
app.use('/api/dailies', dailyRoutes);

export default app;