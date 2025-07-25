import { fileURLToPath } from 'url';
import { jest } from '@jest/globals';
import path from 'path';
import request from 'supertest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock do Firebase Database completo
jest.unstable_mockModule('firebase/database', () => {
  const playlistData = {
    'mocked-id': { title: 'Música 1', artist: 'Artista 1' },
  };

  const createMockRef = (pathStr) => ({
    _path: {
      pieces_: pathStr.split('/'),
    },
  });

  return {
    ref: (db, pathStr) => createMockRef(pathStr),
    get: (ref) => {
      const path = ref?._path?.pieces_?.join('/') ?? '';
      const key = path.replace('playlist/', '');
      if (path === 'songs') {
        return Promise.resolve({
          val: () => [],
          exists: () => true,
        });
      } else if (path === 'playlist') {
        return Promise.resolve({
          val: () => playlistData,
          exists: () => true,
        });
      } else if (playlistData[key]) {
        return Promise.resolve({
          val: () => playlistData[key],
          exists: () => true,
        });
      } else {
        return Promise.resolve({
          val: () => null,
          exists: () => false,
        });
      }
    },
    push: () => ({ key: 'mocked-id' }),
    remove: (ref) => {
      const path = ref?._path?.pieces_?.join('/') ?? '';
      const key = path.replace('playlist/', '');
      if (playlistData[key]) {
        delete playlistData[key];
        return Promise.resolve();
      } else {
        return Promise.reject(new Error('Not found'));
      }
    },
    set: (ref, value) => {
      const path = ref?._path?.pieces_?.join('/') ?? '';
      const key = path.replace('playlist/', '');
      playlistData[key] = value;
      return Promise.resolve();
    },
  };
});

// Carrega o app após os mocks
const playlistApp = (await import('../index.js')).default;

describe('Playlist API (mocked)', () => {
  it('deve retornar status 200 na rota GET /api/songs', async () => {
    const res = await request(playlistApp).get('/api/songs');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve adicionar uma música com POST /api/playlist', async () => {
    const newSong = { title: 'Nova Música', artist: 'Artista' };
    const res = await request(playlistApp).post('/api/playlist').send(newSong);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('deve remover uma música com DELETE /api/playlist/:id', async () => {
    const res = await request(playlistApp).delete('/api/playlist/mocked-id');
    expect(res.statusCode).toBe(204);
  });

  it('deve retornar erro ao deletar id inválido', async () => {
    const res = await request(playlistApp).delete('/api/playlist/invalid-id');
    expect(res.statusCode).toBe(404);
  });
});
