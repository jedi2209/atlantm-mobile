module.exports = {
  rootDir: '..',
  maxWorkers: 1,
  testEnvironment: './e2e/environment',
  testRunner: 'jest-circus/runner',
  testTimeout: 120000,
  testMatch: ['<rootDir>/src/__tests__/**/*.e2e.js'],
  transform: {
    '^.+\\.ts?$': 'ts-jest',
    '\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['../node_modules/'],
  reporters: ['detox/runners/jest/streamlineReporter'],
  verbose: true,
};
