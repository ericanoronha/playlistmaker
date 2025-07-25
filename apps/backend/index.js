import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './src/firebase.js';
import { ref as dbRef, get, set, remove, push } from 'firebase/database';

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://playlistmaker.onrender.com',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Não permitido por CORS'));
    },
  })
);

app.use(express.json());

// SPA static serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Condicional para não iniciar servidor durante testes
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}


app.get('/api/songs', async (req, res) => {
  try {
    const snapshot = await db.ref('trilhas-de-novelas').once('value');
    const data = snapshot.val();

    if (!data) {
      return res.status(404).json({ error: 'Sem dados no Firebase' });
    }

    const songs = Object.values(data);
    res.json(songs);
  } catch (error) {
    console.error('Erro ao buscar músicas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// GET /api/playlist
app.get('/api/playlist', async (req, res) => {
  try {
    const ref = dbRef(db, 'playlist');
    const snapshot = await get(ref);
    const playlist = snapshot.exists()
      ? Object.entries(snapshot.val()).map(([id, item]) => ({ id, ...item }))
      : [];
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar playlist' });
  }
});

// POST /api/playlist
app.post('/api/playlist', async (req, res) => {
  try {
    const newRef = push(dbRef(db, 'playlist'));
    await set(newRef, req.body);
    res.status(201).json({ id: newRef.key });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao adicionar música' });
  }
});

// DELETE /api/playlist/:id
app.delete('/api/playlist/:id', async (req, res) => {
  try {
    const songRef = dbRef(db, `playlist/${req.params.id}`);
    const snapshot = await get(songRef);

    if (!snapshot.exists()) {
      return res.status(404).json({ error: 'Música não encontrada' });
    }

    await remove(songRef);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover música' });
  }
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

export default app;
