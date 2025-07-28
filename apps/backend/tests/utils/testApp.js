import express from 'express';
import playlistRoutes from '../../routes/playlistRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/playlist', playlistRoutes);

export default app;