import type { IPoolItem } from '../types';

import { AbstractPool, IStats, TContinuation } from './AbstractPool';

/**
 * Simple roundrobin
 */
export class RoundRobin<TKey, TValue extends IPoolItem> extends AbstractPool<TKey, TValue> {
  protected iterator: Iterator<TValue, TValue>;
  protected poolStats: IStats = {
    running: 0,
  };
  constructor(override readonly agents: Map<TKey, TValue>) {
    super(agents);
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

  get stats(): IStats {
    return this.poolStats;
  }

  public override async execAsync<TResult = unknown>(continuation: TContinuation<TResult>): Promise<TResult> {
    this.poolStats.running++;
    try {
      const instance = this.getNextItem();
      const result = await continuation(instance);
      return result;
    } finally {
      this.poolStats.running--;
    }
  }
}
