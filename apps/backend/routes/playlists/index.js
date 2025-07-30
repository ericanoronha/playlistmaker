import express from 'express';
import {
  getPlaylist,
  addTrack,
  deleteTrack,
  reorderPlaylist,
} from '../../controllers/playlistController.js';

const router = express.Router();

router.route('/:deviceId').get(getPlaylist).post(addTrack);

router.route('/:deviceId/:trackId').delete(deleteTrack);

router.route('/reorder/:deviceId').put(reorderPlaylist);

export default router;
