import request from 'supertest';
import app from './utils/testApp.js';
import { deviceId, invalidTrackId } from './test.constants.js';

describe('DELETE /api/playlist/:id', () => {
  it('deve remover música com ID válido', async () => {
    const res = await request(app).delete(
      `/api/playlist/mocked-id?deviceId=${deviceId}`,
    );
    expect(res.statusCode).toBe(204);
  });

  it('deve retornar 404 para ID inválido', async () => {
    const res = await request(app).delete(
      `/api/playlist/${invalidTrackId}?deviceId=${deviceId}`,
    );
    expect(res.statusCode).toBe(404);
  });
});