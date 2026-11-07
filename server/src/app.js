import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
}));

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'MindDrop API is running',
    });
});

import notesRoutes from './modules/notes/notes.routes.js';
app.use('/api/notes', notesRoutes);

import aiRoutes from './modules/ai/ai.routes.js';
app.use('/api/ai', aiRoutes);

import { errorHandler } from './middlewares/errorHandler.js';
app.use(errorHandler)

export default app;