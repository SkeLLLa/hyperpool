import type { IPoolItem, IPoolItemWithStats } from '../types';

import { AbstractPool } from './AbstractPool';

export class HashRandomPool<TKey, TValue extends IPoolItem>
  extends AbstractPool<TKey, TValue>
  implements IPoolItemWithStats
{
  static getHashKey(value: string): number {
    const buf = Buffer.from(value).toString('hex', 0, 8);
    return parseInt(buf, 16);
  }
  constructor(override readonly agents: Map<TKey, TValue>) {
    super(agents);
    this.stats.free = Number.POSITIVE_INFINITY;
  }

  getNextItem(hashKey?: number): TValue {
    const agents = Array.from(this.agents.values());
    if (hashKey === undefined) {
      return agents[Math.floor(Math.random() * agents.length)]!;
    }
    const index = hashKey % agents.length;
    return agents[Number(index)]!;
  }

  *[Symbol.iterator](hashKey?: number): Generator<TValue> {
    yield this.getNextItem(hashKey);
  }
}
