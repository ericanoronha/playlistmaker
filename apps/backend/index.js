import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import playlistRoutes from './routes/playlistRoutes.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://playlistmaker.onrender.com',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      return callback(new Error('Não permitido por CORS'));
    },
  }),
);

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.use('/api', playlistRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

export default app;
