/* playlistmaker/apps/backend/index.js */
import express from 'express';
import cors from 'cors';
import playlistRoutes from './routes/playlists/index.js';
import songRoutes from './routes/songs/index.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://playlistmaker.onrender.com',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Não permitido por CORS'));
  },
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

app.use('/api/songs', songRoutes);
app.use('/api/playlist', playlistRoutes);

export default app;
