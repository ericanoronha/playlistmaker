import request from 'supertest';
import app from './utils/testApp.js';
import { deviceId } from './test.constants.js';

describe('GET /api/playlist/:deviceId', () => {
  it('deve obter a playlist do dispositivo', async () => {
    const response = await request(app).get(`/api/playlist/${deviceId}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
