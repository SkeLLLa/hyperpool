import type { IPoolItem } from '../types';

export interface IStats {
  free: number;
  queued: number;
  running: number;
  size: number;
}

export type TContinuationFn<TInstance> = (instance: TInstance) => unknown;

/**
 * AbstractPool
 */
export abstract class AbstractPool<TKey, TValue extends IPoolItem> {
  constructor(protected readonly agents: Map<TKey, TValue>) {
    if (this.agents.size === 0) {
      throw Error('Number of items in pool should be > 0');
    }
    this.stats.size = this.agents.size;
  }

  protected queue: TContinuationFn<TValue>[] = [];

  protected poolStats: IStats = {
    running: 0,
    queued: 0,
    free: 0,
    size: 0,
  };

  get stats(): IStats {
    return this.poolStats;
  }

  get load(): number {
    return this.stats.running / this.stats.size;
  }

  public abstract getNextItem(): TValue;

  public abstract [Symbol.iterator](): Generator<TValue>;

  public getItemByKey(key: TKey): TValue | undefined {
    return this.agents.get(key);
  }

  public enqueue<F extends TContinuationFn<TValue>>(continuation: F): void {
    this.poolStats.queued++;
    this.queue.push(continuation);
    this.drain();
  }

  public drain(): void {
    if (this.queue.length === 0) {
      return;
    }
    if (this.poolStats.free === 0) {
      setTimeout(() => {
        this.drain();
      }, 1000).unref();
      return;
      // reschedule
    }

    const toExec = this.queue.slice(0, this.stats.free);

    void Promise.all(
      toExec.map((continuation) => {
        return this.execAsync(continuation);
      }),
    );
  }

  public async execAsync<F extends TContinuationFn<TValue>>(continuation: F): Promise<ReturnType<F>> {
    this.poolStats.running++;
    this.poolStats.free--;
    try {
      const instance = this.getNextItem();
      const result = await continuation(instance);
      return result as ReturnType<F>;
    } finally {
      this.poolStats.free++;
      this.poolStats.running--;
    }
  }
}
