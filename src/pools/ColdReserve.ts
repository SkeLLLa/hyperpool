import type { IPoolItem, IPoolItemWithStats } from '../types';

import { AbstractPool } from './AbstractPool';

export class ColdReserve<TKey, TValue extends IPoolItem>
  extends AbstractPool<TKey, TValue>
  implements IPoolItemWithStats
{
  protected useMain = true;
  constructor(override readonly agents: Map<TKey, TValue>) {
    super(agents);
    this.stats.free = Number.POSITIVE_INFINITY;
  }

  getNextItem(): TValue {
    const agents = Array.from(this.agents.values());
    if (this.useMain || agents.length === 1) {
      return agents[0]!;
    }
    // use reserve agent
    return agents[1]!;
  }

  /**
   * Switch from main to reserve or vise versa
   * @returns true if reserved agent is now in use
   */
  toggleReserve(): boolean {
    this.useMain = !this.useMain;
    return !this.useMain;
  }

  *[Symbol.iterator](): Generator<TValue> {
    yield this.getNextItem();
  }
}
