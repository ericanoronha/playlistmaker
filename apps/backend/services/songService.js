import { db } from '../src/firebase.js';

export const getAllSongs = async () => {
  const snapshot = await db.ref('trilhas-de-novelas').once('value');
  const trilhas = snapshot.val();

  const songs = [];

  if (trilhas) {
    Object.values(trilhas).forEach((item, index) => {
      if (item.title && item.artist && item.audio) {
        songs.push({
          id: `trilha-${index}`,
          title: item.title,
          artist: item.artist,
          novela: item.novela || '',
          tipo: item.tipo || '',
          audio: item.audio,
        });
      }
    });
  }

  return songs;
};
