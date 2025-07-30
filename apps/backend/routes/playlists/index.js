import express from 'express';
import {
  getPlaylist,
  addTrack,
  deleteTrack,
  reorderPlaylist,
} from '../../controllers/playlistController.js';

const router = express.Router();

/**
 * @swagger
 * /api/playlist/{deviceId}:
 *   get:
 *     summary: Buscar playlist de um dispositivo
 *     parameters:
 *       - name: deviceId
 *         in: path
 *         required: true
 *         description: ID do dispositivo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Playlist encontrada
 *   post:
 *     summary: Adicionar música à playlist
 *     parameters:
 *       - name: deviceId
 *         in: path
 *         required: true
 *         description: ID do dispositivo
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Música adicionada
 */
router.route('/:deviceId').get(getPlaylist).post(addTrack);

/**
 * @swagger
 * /api/playlist/{deviceId}/{trackId}:
 *   delete:
 *     summary: Remover música da playlist
 *     parameters:
 *       - name: deviceId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: trackId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Música removida com sucesso
 */
router.route('/:deviceId/:trackId').delete(deleteTrack);

/**
 * @swagger
 * /api/playlist/reorder/{deviceId}:
 *   put:
 *     summary: Reordenar playlist
 *     parameters:
 *       - name: deviceId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playlist:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Playlist reordenada
 */
router.route('/reorder/:deviceId').put(reorderPlaylist);

export default router;
