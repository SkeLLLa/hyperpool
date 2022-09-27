import type { IPoolItemWithLoad } from '../types';

import type { TContinuation } from './AbstractPool';
import { RoundRobin } from './RoundRobin';

interface IMinLoad {
  curr: number;
  prev: number;
}

export class BalancedRoundRobin<TKey, TValue extends IPoolItemWithLoad> extends RoundRobin<TKey, TValue> {
  protected minLoad: IMinLoad;

  constructor(override readonly agents: Map<TKey, TValue>) {
    super(agents);
    this.minLoad = {
      curr: Number.POSITIVE_INFINITY,
      prev: Number.POSITIVE_INFINITY,
    };
    this.iterator = this.agents.values();
  }

  get load(): number {
    return Array.from(this.agents.values()).reduce((sum, val) => (sum += val.load), 0);
  }

  override getNextItem(): TValue {
    let next = this.iterator.next();
    if (next.done) {
      this.iterator = this.agents.values();
      next = this.iterator.next();
      this.minLoad.prev = this.minLoad.curr;
      this.minLoad.curr = Number.POSITIVE_INFINITY;
    }
    const poolItem = next.value;
    if (poolItem.load < this.minLoad.curr) {
      this.minLoad.curr = poolItem.load;
    }
    if (poolItem.load <= this.minLoad.prev) {
      return poolItem;
    } else {
      return this.getNextItem();
    }
  }

  *[Symbol.iterator](): Generator<TValue> {
    yield this.getNextItem();
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
