/**
 * Simple pool where all items have same priority and load distributed evenly.
 */
export interface IPoolItem {}

/**
 * Pool with selection algorythm that relies on "load" value.
 * Instances with less load will be selected for executing task.
 */
export interface IPoolItemWithLoad extends IPoolItem {
  readonly load: number;
}

/**
 * Pool with selection algorythm that uses instance weight to select instance.
 */
export interface IPoolItemWithWeight extends IPoolItem {
  readonly weight: number;
}
