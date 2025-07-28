export default {
  testEnvironment: 'node',
  transform: {},
  moduleNameMapper: {
    '^firebase/database$': '<rootDir>/tests/__mocks__/firebase/database.js',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    'controllers/**/*.js',
    'services/**/*.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  resetMocks: true,
  clearMocks: true,
  restoreMocks: true,
  forceExit: true,
  maxWorkers: 1,
};