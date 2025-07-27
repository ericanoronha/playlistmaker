const CACHE_KEY = 'playlist_cache';
const EXPIRATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 dias

export function getCachedPlaylist() {
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null;
  const { data, timestamp } = JSON.parse(raw);
  if (Date.now() - timestamp > EXPIRATION_MS) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
  return data;
}

export function cachePlaylist(data) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
}

export function clearPlaylistCache() {
  localStorage.removeItem(CACHE_KEY);
}
