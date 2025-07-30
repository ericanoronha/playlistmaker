import {
  getPlaylistByDevice,
  addTrackToDevice,
  deleteTrackFromDevice,
  reorderPlaylistForDevice,
} from '../services/playlistService.js';

const isValidDeviceId = (id) => /^[a-zA-Z0-9_-]{5,}$/.test(id);
const isValidTrackId = (id) => typeof id === 'string' && id.length > 0;

export const getPlaylist = async (req, res) => {
  const { deviceId } = req.params;

  if (!isValidDeviceId(deviceId)) {
    return res.status(400).json({ error: 'Device ID inválido' });
  }

  try {
    const playlist = await getPlaylistByDevice(deviceId);

    if (!playlist || playlist.length === 0) {
      return res.status(204).json({ message: 'Nenhuma trilha favoritada ainda.' });
    }

    res.status(200).json(playlist);
  } catch (err) {
    console.error('Erro ao buscar playlist:', err);
    res.status(500).json({ error: 'Erro ao carregar a playlist' });
  }
};

export const addTrack = async (req, res) => {
  //console.log('[DEBUG POST body]', req.body);
  const { deviceId } = req.params;
  const track = req.body;

  if (!isValidDeviceId(deviceId)) {
    return res.status(400).json({ error: 'Device ID inválido' });
  }

  if (!track || typeof track !== 'object') {
    return res.status(400).json({ error: 'Track inválido' });
  }

  try {
    const id = await addTrackToDevice(deviceId, track);
    res.status(201).json({ id });
  } catch (err) {
    if (err.message === 'Dados da faixa inválidos') {
      return res.status(400).json({ error: err.message });
    }
    console.error('Erro ao adicionar faixa:', err);
    res.status(500).json({ error: 'Erro ao adicionar faixa' });
  }
};

export const deleteTrack = async (req, res) => {
  const { deviceId, trackId } = req.params;

  if (!isValidDeviceId(deviceId)) {
    return res.status(400).json({ error: 'Device ID inválido' });
  }

  if (!isValidTrackId(trackId)) {
    return res.status(400).json({ error: 'Track ID inválido' });
  }

  try {
    await deleteTrackFromDevice(deviceId, trackId);
    res.status(204).end();
  } catch (err) {
    if (err.message === 'Faixa não encontrada') {
      return res.status(404).json({ error: err.message });
    }
    console.error('Erro ao remover faixa:', err);
    res.status(500).json({ error: 'Erro ao remover faixa' });
  }
};

export const reorderPlaylist = async (req, res) => {
  const { deviceId } = req.params;
  const { playlist } = req.body;

  if (!isValidDeviceId(deviceId)) {
    return res.status(400).json({ error: 'Device ID inválido' });
  }

  if (!Array.isArray(playlist)) {
    return res.status(400).json({ error: 'Formato da playlist inválido' });
  }

  try {
    await reorderPlaylistForDevice(deviceId, playlist);
    res.status(200).json({ message: 'Playlist reordenada com sucesso' });
  } catch (err) {
    if (
      err.message === 'A playlist enviada não é um array' ||
      err.message === 'Item da playlist sem ID'
    ) {
      return res.status(400).json({ error: err.message });
    }

    console.error('Erro ao reordenar playlist:', err);
    res.status(500).json({ error: 'Erro ao reordenar playlist' });
  }
};
