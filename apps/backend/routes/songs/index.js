import { Router } from 'express';
import { getAllSongs } from '../../services/songService.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const songs = await getAllSongs();

    if (!songs.length) {
      return res.status(204).send();
    }

    res.status(200).json(songs);
  } catch (error) {
    console.error('[GET /api/songs] Erro ao carregar trilhas:', error);
    res.status(500).json({ error: 'Erro ao carregar as trilhas' });
  }
});

export default router;
