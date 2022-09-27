import type { IPoolItemWithLoad } from '../types';

import type { TContinuation } from './AbstractPool';
import { BalancedRoundRobin } from './BalancedRoundRobin';

export interface IConfig {
  concurrencyMax?: number;
  concurrencyMin?: number;
  concurrencyPenalty?: number;
  concurrencyReward?: number;
}

export class DynamicBalancedConcurrency<TKey, TValue extends IPoolItemWithLoad> extends BalancedRoundRobin<
  TKey,
  TValue
> {
  protected currentMaxCurrency: number;
  protected config: Required<IConfig>;
  constructor(override readonly agents: Map<TKey, TValue>, readonly options: IConfig) {
    super(agents);
    this.config = {
      concurrencyMax: options.concurrencyMax ?? Number.POSITIVE_INFINITY,
      concurrencyMin: options.concurrencyMin ?? 1,
      concurrencyPenalty: options.concurrencyPenalty ?? 1,
      concurrencyReward: options.concurrencyReward ?? 1,
    };
    this.currentMaxCurrency = this.config.concurrencyMax;
    this.minLoad = {
      curr: Number.POSITIVE_INFINITY,
      prev: Number.POSITIVE_INFINITY,
    };
    this.iterator = this.agents.values();
  }

  override get load(): number {
    return this.poolStats.running;
  }

  private reward(): void {
    this.currentMaxCurrency += this.config.concurrencyReward;
    if (this.currentMaxCurrency > this.config.concurrencyMax) {
      this.currentMaxCurrency = this.config.concurrencyMax;
    }
  }

  private penalize(): void {
    this.currentMaxCurrency -= this.config.concurrencyPenalty;
    if (this.currentMaxCurrency < this.config.concurrencyMin) {
      this.currentMaxCurrency = this.config.concurrencyMin;
    }
  }

  public override async execAsync<TResult = unknown>(continuation: TContinuation<TResult>): Promise<TResult> {
    if (this.poolStats.running >= this.currentMaxCurrency) {
      throw Error('Max concurency value reached');
    }
    this.poolStats.running++;
    try {
      const instance = this.getNextItem();
      const result = await continuation(instance);
      this.reward();
      return result;
    } catch (err) {
      this.penalize();
      throw err;
    } finally {
      this.poolStats.running--;
    }
  }
}
