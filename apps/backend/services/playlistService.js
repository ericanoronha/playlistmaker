import { db } from '../src/firebase.js';
import { ref as dbRef, get, set, remove, push } from 'firebase/database';

export const getAllSongs = async () => {
  const snapshot = await db.ref('trilhas-de-novelas').once('value');
  const data = snapshot.val();
  return data ? Object.values(data) : [];
};

export const getPlaylistByDevice = async (deviceId) => {
  const ref = dbRef(db, `playlist/${deviceId}`);
  const snapshot = await get(ref);
  return snapshot.exists()
    ? Object.entries(snapshot.val()).map(([id, item]) => ({ id, ...item }))
    : [];
};

export const addTrackToDevice = async (deviceId, trackData) => {
  const newRef = push(dbRef(db, `playlist/${deviceId}`));
  await set(newRef, trackData);
  return newRef.key;
};

export const deleteTrackFromDevice = async (deviceId, trackId) => {
  const ref = dbRef(db, `playlist/${deviceId}/${trackId}`);
  const snapshot = await get(ref);
  if (!snapshot.exists()) return false;
  await remove(ref);
  return true;
};

export const reorderPlaylistForDevice = async (deviceId, playlist) => {
  const reorderedData = {};
  for (const item of playlist) {
    if (!item.id) throw new Error('Item da playlist sem ID');
    const { id, ...rest } = item;
    reorderedData[id] = rest;
  }
  await set(dbRef(db, `playlist/${deviceId}`), reorderedData);
};