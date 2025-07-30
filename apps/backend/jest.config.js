export default {
  testEnvironment: 'node',
  transform: {},
  transformIgnorePatterns: ['/node_modules/(?!supertest)/'],
  moduleNameMapper: {
    '^firebase/database$': '<rootDir>/tests/__mocks__/firebase/database.mjs',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    'controllers/**/*.js',
    'services/**/*.js',
    'routes/**/*.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  resetMocks: true,
  clearMocks: true,
  restoreMocks: true,
};