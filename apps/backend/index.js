import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
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

// Rotas da API
app.use('/api/songs', songRoutes);
app.use('/api/playlist', playlistRoutes);

// Frontend em produção
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

export default app;
