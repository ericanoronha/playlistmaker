import {
  getAllSongs,
  getPlaylistByDevice,
  addTrackToDevice,
  deleteTrackFromDevice,
  reorderPlaylistForDevice,
} from '../services/playlistService.js';

export const getSongs = async (req, res) => {
  try {
    const songs = await getAllSongs();
    res.json(songs);
  } catch (err) {
    console.error('Erro ao buscar músicas:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getPlaylist = async (req, res) => {
  const { deviceId } = req.params;
  if (!deviceId)
    return res.status(400).json({ error: 'Parâmetro deviceId obrigatório' });

  try {
    const playlist = await getPlaylistByDevice(deviceId);
    res.json(playlist);
  } catch (err) {
    console.error('Erro ao buscar playlist:', err);
    res.status(500).json({ error: 'Erro ao carregar playlist' });
  }
};

export const addTrack = async (req, res) => {
  const { deviceId } = req.params;
  if (!deviceId)
    return res.status(400).json({ error: 'Parâmetro deviceId obrigatório' });

  try {
    const id = await addTrackToDevice(deviceId, req.body);
    res.status(201).json({ id });
  } catch (err) {
    console.error('Erro ao adicionar música:', err);
    res.status(500).json({ error: 'Erro ao adicionar música' });
  }
};

export const deleteTrack = async (req, res) => {
  const { deviceId, trackId } = req.params;
  if (!deviceId)
    return res.status(400).json({ error: 'Parâmetro deviceId obrigatório' });

  try {
    const success = await deleteTrackFromDevice(deviceId, trackId);
    if (!success)
      return res.status(404).json({ error: 'Música não encontrada' });
    res.status(204).end();
  } catch (err) {
    console.error('Erro ao remover música:', err);
    res.status(500).json({ error: 'Erro ao remover música' });
  }
};

export const reorderPlaylist = async (req, res) => {
  const { deviceId } = req.params;
  const { playlist } = req.body;
  if (!deviceId)
    return res.status(400).json({ error: 'Parâmetro deviceId obrigatório' });
  if (!Array.isArray(playlist))
    return res.status(400).json({ error: 'Formato de playlist inválido' });

  try {
    await reorderPlaylistForDevice(deviceId, playlist);
    res.status(200).json({ message: 'Playlist reordenada com sucesso' });
  } catch (err) {
    console.error('Erro ao reordenar playlist:', err);
    res.status(500).json({ error: 'Erro ao reordenar playlist' });
  }
};