import request from 'supertest';
import app from './utils/testApp.js';
import { deviceId, reorderedPlaylist } from './test.constants.js';
import { resetMockData } from './__mocks__/firebase/database.mjs';

beforeEach(resetMockData);

describe('PUT /api/playlist/reorder/:deviceId', () => {
  it('deve reordenar a playlist', async () => {
    const response = await request(app)
      .put(`/api/playlist/reorder/${deviceId}`)
      .send({ playlist: reorderedPlaylist });
    expect(response.status).toBe(200);
  });

  it('deve retornar erro se playlist for inválida', async () => {
    const res = await request(app)
      .put(`/api/playlist/reorder/${deviceId}`)
      .send({ playlist: 'invalid' });
    expect(res.status).toBe(400);
  });
});