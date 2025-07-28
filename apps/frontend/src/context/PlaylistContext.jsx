import React, { createContext, useContext, useState, useCallback } from 'react';
import { getDeviceId } from '../utils/deviceId';
import { getCachedPlaylist, setCachedPlaylist } from '../utils/cacheUtils';

const PlaylistContext = createContext();

export const PlaylistProvider = ({ children }) => {
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const deviceId = getDeviceId();

  const fetchPlaylist = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const cached = getCachedPlaylist(deviceId);
      if (cached && cached.length > 0) {
        setPlaylist(cached);
      } else {
        const res = await fetch(`/api/playlist/${encodeURIComponent(deviceId)}`);
        if (!res.ok) throw new Error('Erro ao buscar playlist');

        const data = await res.json();
        setPlaylist(data);
        setCachedPlaylist(deviceId, data);
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar a playlist');
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  const addTrack = async (track) => {
    const res = await fetch(`/api/playlist/${encodeURIComponent(deviceId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(track),
    });

    if (!res.ok) throw new Error('Erro ao adicionar à playlist');

    await fetchPlaylist();
  };

  const removeTrack = async (id) => {
    const res = await fetch(`/api/playlist/${id}?deviceId=${deviceId}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Erro ao remover faixa');

    await fetchPlaylist();
  };

  const reorderPlaylist = (fromIndex, toIndex) => {
    const updated = [...playlist];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setPlaylist(updated);
    setCachedPlaylist(deviceId, updated);
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

export const usePlaylist = () => {
  return useContext(PlaylistContext);
};
