import { Router } from 'express';
import { getAllSongs } from '../../services/songService.js';

const router = Router();

/**
 * @swagger
 * /api/songs:
 *   get:
 *     summary: Lista todas as músicas disponíveis
 *     responses:
 *       200:
 *         description: Lista de músicas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       204:
 *         description: Nenhuma música encontrada
 */
router.get('/', async (req, res) => {
  try {
    const songs = await getAllSongs();

    if (!songs.length) {
      return res.status(200).json({ message: 'Nenhuma faixa favoritada ainda.' });
    }

    res.status(200).json(songs);
  } catch (error) {
    console.error('[GET /api/songs] Erro ao carregar faixas:', error);
    res.status(500).json({ error: 'Erro ao carregar as faixas' });
  }
});

export default router;
