import { describe, expect, test } from '@jest/globals';
import defer from 'p-defer';

import { PoolItemMock } from '../../__tests__/PoolItemMock.mock';
import { DynamicBalancedConcurrency } from '../DynamicBalancedConcurrency';
import { StaticPool } from '../Static';

describe('Dynamic Balanced Concurrency', () => {
  test('Throws error if max concurrency reached', async () => {
    const a = new StaticPool(new Map([['a', new PoolItemMock('a')]]));
    const b = new StaticPool(new Map([['b', new PoolItemMock('b')]]));
    const c = new StaticPool(new Map([['c', new PoolItemMock('c')]]));

    const pm = new DynamicBalancedConcurrency(
      new Map([
        ['a', a],
        ['b', b],
        ['c', c],
      ]),
      {
        concurrencyMax: 2,
        concurrencyMin: 1,
      },
    );

    const workloadA = defer();
    const workloadB = defer();
    const workloadC = defer();
    const workloadD = defer();

    const task1 = pm.execAsync(async (instance) => {
      expect(instance).toBe(a);
      return await instance.execAsync(async () => {
        return await workloadA.promise;
      });
    });

    const task2 = pm.execAsync(async (instance) => {
      expect(instance).toBe(b);
      return await instance.execAsync(async () => {
        return await workloadB.promise;
      });
    });
    expect(pm.stats).toMatchInlineSnapshot(`
      {
        "free": 0,
        "queued": 0,
        "running": 2,
        "size": 2,
      }
    `);

    const task3 = pm.execAsync(async (instance) => {
      expect(instance).toBe(c);
      return await instance.execAsync(async () => {
        return await workloadC.promise;
      });
    });

    workloadA.resolve('a:done');
    workloadB.resolve('b:done');
    workloadC.resolve('c:done');

    await expect(task1).resolves.toMatchInlineSnapshot(`"a:done"`);
    await expect(task2).resolves.toMatchInlineSnapshot(`"b:done"`);
    await expect(task3).rejects.toMatchInlineSnapshot(`[Error: Max concurency value reached]`);

    const task4 = pm.execAsync(async (instance) => {
      expect(instance).toBe(c);
      return await instance.execAsync(async () => {
        return await workloadD.promise;
      });
    });

    workloadD.resolve('d:done');
    await expect(task4).resolves.toMatchInlineSnapshot(`"d:done"`);
  });
});
