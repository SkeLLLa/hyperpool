import type { IPoolItem, IPoolItemWithStats } from '../types';

import { AbstractPool } from './AbstractPool';

export class StaticPool<TKey, TValue extends IPoolItem>
  extends AbstractPool<TKey, TValue>
  implements IPoolItemWithStats
{
  constructor(override readonly agents: Map<TKey, TValue>) {
    super(agents);
    this.stats.free = Number.POSITIVE_INFINITY;
  }

  getNextItem(): TValue {
    const agents = Array.from(this.agents.values());
    return agents[0]!;
  }

  *[Symbol.iterator](): Generator<TValue> {
    yield this.getNextItem();
  }
}
