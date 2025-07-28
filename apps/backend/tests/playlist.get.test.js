import request from 'supertest';
import app from './utils/testApp.js';
import { deviceId } from './test.constants.js';

describe('GET /api/playlist', () => {
  it('deve retornar 400 se deviceId estiver ausente', async () => {
    const res = await request(app).get('/api/playlist');
    expect(res.statusCode).toBe(400);
  });

  it('deve retornar 200 com array se deviceId for válido', async () => {
    const res = await request(app).get(`/api/playlist?deviceId=${deviceId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});