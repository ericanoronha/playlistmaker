import { jest } from '@jest/globals';

await jest.unstable_mockModule(
  'firebase/database',
  () => import('../__mocks__/firebase/database.js')
);

const app = (await import('../../index.js')).default;
export default app;