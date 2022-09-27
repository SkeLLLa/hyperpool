import type { IPoolItem } from '../types';

import { AbstractPool, IStats, TContinuation } from './AbstractPool';

export class GenericPool<TKey, TValue extends IPoolItem> extends AbstractPool<TKey, TValue> {
  constructor(override readonly agents: Map<TKey, TValue>) {
    super(agents);
  }

  protected poolStats: IStats = {
    running: 0,
  };

  getNextItem(): TValue {
    const agents = Array.from(this.agents.values());
    return agents[Math.floor(Math.random() * agents.length)]!;
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
