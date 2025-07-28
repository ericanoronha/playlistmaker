const CACHE_KEY_PREFIX = 'playlist_';
const EXPIRATION_DAYS = 30;

export const getCachedPlaylist = (deviceId) => {
  const raw = localStorage.getItem(`${CACHE_KEY_PREFIX}${deviceId}`);
  if (!raw) return null;

  try {
    const { data, timestamp } = JSON.parse(raw);
    const now = Date.now();
    const diffDays = (now - timestamp) / (1000 * 60 * 60 * 24);
    if (diffDays > EXPIRATION_DAYS) {
      localStorage.removeItem(`${CACHE_KEY_PREFIX}${deviceId}`);
      return null;
    }
    return data;
  } catch (e) {
    console.error('Erro ao ler cache da playlist', e);
    return null;
  }
};

export const setCachedPlaylist = (deviceId, data) => {
  const value = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(`${CACHE_KEY_PREFIX}${deviceId}`, JSON.stringify(value));
};

export const clearDeviceCache = () => {
  const keysToRemove = Object.keys(localStorage).filter(
    (key) => key.startsWith(CACHE_KEY_PREFIX) || key === 'deviceId',
  );
  keysToRemove.forEach((key) => localStorage.removeItem(key));
};