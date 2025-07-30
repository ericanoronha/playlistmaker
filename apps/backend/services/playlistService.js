import { db } from '../src/firebase.js';
import { ref as dbRef, get, set, remove, push } from 'firebase/database';

const getAllSongs = async () => {
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
  if (
    !trackData ||
    typeof trackData !== 'object' ||
    Array.isArray(trackData) ||
    Object.keys(trackData).length === 0
  ) {
    throw new Error('Dados da faixa inválidos');
  }

  const newRef = push(dbRef(db, `playlist/${deviceId}`));
  await set(newRef, trackData);
  return newRef.key;
};

export const deleteTrackFromDevice = async (deviceId, trackId) => {
  const ref = dbRef(db, `playlist/${deviceId}/${trackId}`);
  const snapshot = await get(ref);
  if (!snapshot.exists()) {
    throw new Error('Faixa não encontrada');
  }

  await remove(ref);
  return true;
};

export const reorderPlaylistForDevice = async (deviceId, playlist) => {
  if (!Array.isArray(playlist)) {
    throw new Error('A playlist enviada não é um array');
  }

  const reorderedData = {};
  for (const item of playlist) {
    if (!item.id) throw new Error('Item da playlist sem ID');
    const { id, ...rest } = item;
    reorderedData[id] = rest;
  }

  await set(dbRef(db, `playlist/${deviceId}`), reorderedData);
};
