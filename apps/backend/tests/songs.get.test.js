import request from 'supertest';
import app from './utils/testApp.js';

describe('GET /api/songs', () => {
  it('deve retornar lista de músicas', async () => {
    const res = await request(app).get('/api/songs');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('title');
    }
  });
});