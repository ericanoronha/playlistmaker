import request from 'supertest';
import app from './utils/testApp.js';
import { deviceId, mockTrack } from './test.constants.js';
import { resetMockData } from './__mocks__/firebase/database.mjs';

beforeEach(resetMockData);

describe('POST /api/playlist', () => {
  it('deve adicionar uma faixa à playlist', async () => {
    const response = await request(app)
      .post(`/api/playlist/${deviceId}`)
      .send(mockTrack);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id', 'mocked-id');
  });
});
