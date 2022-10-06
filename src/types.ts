import type { IStats } from './pools/AbstractPool';

/**
 * Simple pool where all items have same priority and load distributed evenly.
 */
export interface IPoolItem {}

/**
 * Pool with selection algorythm that relies on "load" value.
 * Instances with less load will be selected for executing task.
 */
export interface IPoolItemWithStats extends IPoolItem {
  readonly stats: IStats;
  readonly load: number;
}
