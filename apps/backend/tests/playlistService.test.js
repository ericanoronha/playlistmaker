import { jest } from '@jest/globals';

import {
  getPlaylistByDevice,
  addTrackToDevice,
  deleteTrackFromDevice,
  reorderPlaylistForDevice,
} from '../services/playlistService.js';

import {
  ref as mockRef,
  get as mockGet,
  set as mockSet,
  remove as mockRemove,
  push as mockPush,
  resetMockData,
} from './__mocks__/firebase/database.mjs';

jest.mock('firebase/database', () => ({
  ref: mockRef,
  get: mockGet,
  set: mockSet,
  remove: mockRemove,
  push: mockPush,
}));

beforeEach(() => {
  resetMockData();
});

const deviceId = 'test123';
const invalidDeviceId = 'invalid-id';
const validTrack = {
  nome: 'Nova música',
  interprete: 'Novo artista',
  audio: 'https://youtube.com/nova',
  novela: 'Senhora do Destino',
  tipo: 'nacional',
};

describe('playlistService', () => {
  describe('getPlaylistByDevice', () => {
    it('deve retornar a playlist de um dispositivo válido', async () => {
      const result = await getPlaylistByDevice(deviceId);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toHaveProperty('id');
    });

    it('deve retornar um array vazio se o dispositivo não existir', async () => {
      const result = await getPlaylistByDevice(invalidDeviceId);
      expect(result).toEqual([]);
    });
  });

  describe('addTrackToDevice', () => {
    it('deve adicionar uma nova faixa com sucesso', async () => {
      const id = await addTrackToDevice(deviceId, validTrack);
      expect(id).toBe('mocked-id');
    });

    it('deve lançar erro se track for inválido', async () => {
      await expect(addTrackToDevice(deviceId, null)).rejects.toThrow(
        'Dados da faixa inválidos',
      );
    });
  });

  describe('deleteTrackFromDevice', () => {
    it('deve retornar true se a faixa for removida', async () => {
      const result = await deleteTrackFromDevice(deviceId, 'mocked-id');
      expect(result).toBe(true);
    });

    it('deve lançar erro se a faixa não existir', async () => {
      await expect(
        deleteTrackFromDevice(deviceId, 'faixa-inexistente'),
      ).rejects.toThrow('Faixa não encontrada');
    });
  });

  describe('reorderPlaylistForDevice', () => {
    it('deve reordenar a playlist com sucesso', async () => {
      const reordered = [
        {
          id: 'mocked-id',
          nome: 'Nova Ordem',
          interprete: 'Zezé',
          audio: 'https://youtube.com/new',
          novela: 'A Favorita',
          tipo: 'nacional',
        },
      ];
      await expect(
        reorderPlaylistForDevice(deviceId, reordered),
      ).resolves.toBeUndefined();
    });

    it('deve lançar erro se playlist não for array', async () => {
      await expect(
        reorderPlaylistForDevice(deviceId, 'invalido'),
      ).rejects.toThrow('A playlist enviada não é um array');
    });

    it('deve lançar erro se algum item não tiver ID', async () => {
      const broken = [{ nome: 'Sem ID' }];
      await expect(reorderPlaylistForDevice(deviceId, broken)).rejects.toThrow(
        'Item da playlist sem ID',
      );
    });
  });
});
