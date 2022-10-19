import type { JestConfigWithTsJest } from 'ts-jest';
import tsjPreset from 'ts-jest/presets';

const config: JestConfigWithTsJest = {
  ...tsjPreset.defaults,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.(ts|js)'],
  coverageReporters: ['lcov', 'text', 'json', 'html'],
  verbose: true,
  maxWorkers: 4,
  coverageProvider: 'v8',
  displayName: {
    name: 'UNIT',
    color: 'blue',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'], // ignore mocks in dist folder
  testMatch: ['**/*.unit.spec.ts'],
};
export default config;
