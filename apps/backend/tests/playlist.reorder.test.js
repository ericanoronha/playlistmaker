import request from 'supertest';
import app from './utils/testApp.js';
import { deviceId, reorderedPlaylist } from './test.constants.js';

describe('PUT /api/playlist/reorder/:deviceId', () => {
  it('deve reordenar a playlist', async () => {
    const response = await request(app)
      .put(`/api/playlist/reorder/${deviceId}`)
      .send({ playlist: reorderedPlaylist });
    expect(response.status).toBe(200);
  });
});
