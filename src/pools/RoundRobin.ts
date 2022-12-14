import type { IPoolItem, IPoolItemWithStats } from '../types';

import { AbstractPool } from './AbstractPool';

/**
 * Simple roundrobin
 */
export class RoundRobin<TKey, TValue extends IPoolItem>
  extends AbstractPool<TKey, TValue>
  implements IPoolItemWithStats
{
  protected iterator: Iterator<TValue, TValue>;

  constructor(override readonly agents: Map<TKey, TValue>) {
    super(agents);
    this.stats.free = Number.POSITIVE_INFINITY;
    this.iterator = this.agents.values();
  }

  getNextItem(): TValue {
    let next = this.iterator.next();
    if (next.done) {
      this.iterator = this.agents.values();
      next = this.iterator.next();
    }
    return next.value;
  }

  *[Symbol.iterator](): Generator<TValue> {
    yield this.getNextItem();
  }
}
