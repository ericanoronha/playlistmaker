import request from 'supertest';
import app from './utils/testApp.js';
import { deviceId, reorderedPlaylist } from './test.constants.js';

describe('PUT /api/playlist/reorder', () => {
  it('deve atualizar a ordem da playlist', async () => {
    const res = await request(app)
      .put(`/api/playlist/reorder?deviceId=${deviceId}`)
      .send({ playlist: reorderedPlaylist });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});