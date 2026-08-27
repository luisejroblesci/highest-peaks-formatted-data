import type { Config } from 'jest';

const config: Config = {
  testEnvironment: '@circleci/jest-circleci-coverage/environment-jsdom',
  reporters: ['default', '@circleci/jest-circleci-coverage/reporter'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
  },
};

export default config;
