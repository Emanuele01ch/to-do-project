import express from 'express';
import cors from 'cors';
import todosRouter from './routes/todos.js';

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

app.use('/api/todos', todosRouter);

export default app;