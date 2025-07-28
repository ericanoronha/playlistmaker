import express from 'express';
import {
  getSongs,
  getPlaylist,
  addTrack,
  deleteTrack,
  reorderPlaylist,
} from '../controllers/playlistController.js';

const router = express.Router();

router.get('/songs', getSongs);
router.get('/playlist', getPlaylist);
router.post('/playlist', addTrack);
router.delete('/playlist/:id', deleteTrack);
router.put('/playlist/reorder', reorderPlaylist);

export default router;