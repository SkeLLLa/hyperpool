import type { IPoolItem } from '../types';

export type TContinuation<TResult> = <TInstance>(instance: TInstance) => PromiseLike<TResult>;

export interface IStats {
  running: number;
}

/**
 * AbstractPool
 */
export abstract class AbstractPool<TKey, TValue extends IPoolItem> {
  constructor(protected readonly agents: Map<TKey, TValue>) {
    if (this.agents.size === 0) {
      throw Error('Number of items in pool should be > 0');
    }
  }

  public abstract get stats(): IStats;

  public abstract getNextItem(): TValue;

  public abstract [Symbol.iterator](): Generator<TValue>;

  public abstract execAsync<TResult = unknown>(continuation: TContinuation<TResult>): Promise<TResult>;
}
