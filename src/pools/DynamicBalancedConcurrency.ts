import { EHyperpoolErrorCodes, HyperpoolError } from '../errors';
import type { IPoolItemWithStats } from '../types';

import type { IStats } from './AbstractPool';
import { BalancedRoundRobin } from './BalancedRoundRobin';

export interface IConfig {
  concurrencyMax?: number;
  concurrencyMin?: number;
  concurrencyPenalty?: number;
  concurrencyReward?: number;
  targetRunTime?: number;
}

export class DynamicBalancedConcurrency<TKey, TValue extends IPoolItemWithStats> extends BalancedRoundRobin<
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
      targetRunTime: options.targetRunTime ?? Number.POSITIVE_INFINITY,
    };
    this.currentMaxCurrency = this.config.concurrencyMax;
    this.minLoad = {
      curr: Number.POSITIVE_INFINITY,
      prev: Number.POSITIVE_INFINITY,
    };
    this.iterator = this.agents.values();
  }

  override get load() {
    return this.stats.running / this.stats.free + this.stats.running;
  }

  override get stats(): IStats {
    return {
      ...this.poolStats,
      size: this.currentMaxCurrency,
      free: this.currentMaxCurrency - this.poolStats.running,
    };
  }

  public reward(): void {
    this.currentMaxCurrency += this.config.concurrencyReward;
    if (this.currentMaxCurrency > this.config.concurrencyMax) {
      this.currentMaxCurrency = this.config.concurrencyMax;
    }
  }

  public penalize(): void {
    this.currentMaxCurrency -= this.config.concurrencyPenalty;
    if (this.currentMaxCurrency < this.config.concurrencyMin) {
      this.currentMaxCurrency = this.config.concurrencyMin;
    }
  }

  public override async execAsync<F extends (instance: TValue) => unknown>(continuation: F): Promise<ReturnType<F>> {
    if (this.poolStats.running >= this.currentMaxCurrency) {
      throw new HyperpoolError({
        code: EHyperpoolErrorCodes.NoAgentsAvailable,
        message: 'Max concurency value reached',
      });
    }
    const start = new Date();
    this.poolStats.running++;
    try {
      const instance = this.getNextItem();
      const result = await continuation(instance);
      const end = new Date();
      end.getTime() - start.getTime() > this.config.targetRunTime ? this.penalize() : this.reward();
      return result as ReturnType<F>;
    } catch (err) {
      this.penalize();
      throw err;
    } finally {
      this.poolStats.running--;
    }
  }
}
