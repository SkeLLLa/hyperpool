import { jest } from '@jest/globals';
import 'jest-mock';

import type { IStats } from '../pools/AbstractPool';
import type { IPoolItemWithStats } from '../types';

export class PoolItemWithStatsMock implements IPoolItemWithStats {
  public stats: IStats = {
    running: 0,
    queued: 0,
    free: 0,
    size: 0,
  };

  public get load() {
    return this.stats.running;
  }

  constructor(public readonly name: string) {}

  execAsync = jest.fn(async (promise: Promise<unknown>) => {
    this.stats.running++;
    this.stats.free--;
    try {
      await promise;
    } finally {
      this.stats.free++;
      this.stats.running--;
    }
  });
}
