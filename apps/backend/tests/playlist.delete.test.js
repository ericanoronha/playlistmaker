import request from 'supertest';
import app from './utils/testApp.js';
import { deviceId, invalidTrackId } from './test.constants.js';

describe('DELETE /api/playlist/:deviceId/:trackId', () => {
  it('deve retornar erro ao tentar deletar faixa inválida', async () => {
    const response = await request(app)
      .delete(`/api/playlist/${deviceId}/${invalidTrackId}`);
    expect(response.status).toBe(404);
  });
});
