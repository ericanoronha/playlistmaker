import express from 'express';
import {
  getPlaylist,
  addTrack,
  deleteTrack,
  reorderPlaylist,
} from '../controllers/playlistController.js';

const router = express.Router();

router.get('/:deviceId', getPlaylist);
router.post('/:deviceId', addTrack);
router.delete('/:deviceId/:trackId', deleteTrack);
router.put('/reorder/:deviceId', reorderPlaylist);

export default router;