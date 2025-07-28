import request from 'supertest';
import app from './utils/testApp.js';
import { deviceId, sampleTrack } from './test.constants.js';

describe('POST /api/playlist', () => {
  it('deve adicionar uma música na playlist', async () => {
    const res = await request(app)
      .post(`/api/playlist?deviceId=${deviceId}`)
      .send(sampleTrack);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
