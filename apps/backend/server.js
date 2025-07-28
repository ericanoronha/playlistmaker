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

app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.use((req, res, next) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno no servidor' });
});

export default app;
