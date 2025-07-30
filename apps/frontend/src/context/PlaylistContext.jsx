import React, { createContext, useContext, useState, useCallback } from 'react';
import { getDeviceId } from '../utils/deviceId';
import { getCachedPlaylist, setCachedPlaylist } from '../utils/cacheUtils';

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const deviceId = getDeviceId();

  const fetchPlaylist = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const cached = getCachedPlaylist(deviceId);
      if (cached?.length) {
        setPlaylist(cached);
      } else {
        const res = await fetch(
          `/api/playlist/${encodeURIComponent(deviceId)}`,
        );
        if (!res.ok) throw new Error('Erro ao buscar playlist');

        const data = await res.json();
        setPlaylist(data);
        setCachedPlaylist(deviceId, data);
      }
    } catch (err) {
      console.error('[PlaylistContext] Falha ao carregar playlist:', err);
      setError('Erro ao carregar a playlist');
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  const addTrack = async (track) => {
    if (!track || typeof track !== 'object') {
      throw new Error('Faixa inválida');
    }

    const res = await fetch(`/api/playlist/${encodeURIComponent(deviceId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(track),
    });

    if (!res.ok) throw new Error('Erro ao adicionar faixa à playlist');

    await fetchPlaylist();
  };

  const removeTrack = async (id) => {
    if (!id) throw new Error('ID inválido para remoção');

    const res = await fetch(
      `/api/playlist/${encodeURIComponent(deviceId)}/${id}`,
      {
        method: 'DELETE',
      },
    );

    if (!res.ok) throw new Error('Erro ao remover faixa da playlist');

    await fetchPlaylist();
  };

  const reorderPlaylist = async (fromIndex, toIndex) => {
    const updated = [...playlist];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setPlaylist(updated);
    setCachedPlaylist(deviceId, updated);

    try {
      await fetch(`/api/playlist/reorder/${encodeURIComponent(deviceId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playlist: updated }),
      });
    } catch (err) {
      console.error(
        '[PlaylistContext] Falha ao sincronizar reordenação com backend:',
        err,
      );
    }
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlist,
        loading,
        error,
        fetchPlaylist,
        addTrack,
        removeTrack,
        reorderPlaylist,
        currentTrack,
        setCurrentTrack,
        snackbar,
        setSnackbar,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => useContext(PlaylistContext);
