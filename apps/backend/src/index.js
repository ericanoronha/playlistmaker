import express from 'express';
import cors from 'cors';
import playlistRoutes from '../routes/playlists/index.js';
import songRoutes from '../routes/songs/index.js';
import { setupSwagger } from './config/swagger.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3901',
  'https://playlistmaker.onrender.com',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS bloqueado: ${origin}`));
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  }),
);

app.use(express.json());

app.use('/api/songs', songRoutes);
app.use('/api/playlist', playlistRoutes);
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Swagger UI
setupSwagger(app);

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

export default app;
