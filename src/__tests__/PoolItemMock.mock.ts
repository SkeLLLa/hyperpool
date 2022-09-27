import type { IPoolItem } from '../types';

export class PoolItemMock implements IPoolItem {
  constructor(public readonly name: string) {}
}
