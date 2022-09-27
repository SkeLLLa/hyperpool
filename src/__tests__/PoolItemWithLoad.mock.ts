import { jest } from '@jest/globals';
import 'jest-mock';

import type { IPoolItemWithLoad } from '../types';

export class PoolItemWithLoadMock implements IPoolItemWithLoad {
  public load: number;

  constructor(public readonly name: string, load = 0) {
    this.load = load;
  }

  increaseLoad = jest.fn(() => {
    this.load++;
  });

  decreaseLoad = jest.fn(() => {
    this.load--;
  });
}
