import type { Config } from '@jest/types';
import { defaults as tsjPreset } from 'ts-jest/presets';

const config: Config.InitialOptions = {
  verbose: true,
  collectCoverageFrom: ['src/**/*.ts'],
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
  transform: {
    ...tsjPreset.transform,
  },
};
export default config;
