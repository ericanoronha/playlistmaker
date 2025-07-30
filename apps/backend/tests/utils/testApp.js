import express from 'express';
import playlistRoutes from '../../routes/playlists/index.js';
import songRoutes from '../../routes/songs/index.js';

const app = express();
app.use(express.json());
app.use('/api/playlist', playlistRoutes);
app.use('/api/songs', songRoutes);

export default app;