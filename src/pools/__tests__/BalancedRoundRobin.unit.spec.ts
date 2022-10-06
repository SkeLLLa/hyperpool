import { describe, expect, test } from '@jest/globals';
import defer from 'p-defer';

import { PoolItemMock } from '../../__tests__/PoolItemMock.mock';
import { PoolItemWithStatsMock } from '../../__tests__/PoolItemWithStats.mock';
import { BalancedRoundRobin } from '../BalancedRoundRobin';
import { StaticPool } from '../Static';

describe('Balanced round-robin', () => {
  test('Lowest load item taken first', async () => {
    const a = new StaticPool(new Map([['a', new PoolItemMock('a')]]));
    const b = new StaticPool(new Map([['b', new PoolItemMock('b')]]));
    const c = new StaticPool(new Map([['c', new PoolItemMock('c')]]));

    const pm = new BalancedRoundRobin(
      new Map([
        ['a', a],
        ['b', b],
        ['c', c],
      ]),
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
    expect(pm.stats).toMatchInlineSnapshot(`
      {
        "free": Infinity,
        "queued": 0,
        "running": 1,
        "size": 3,
      }
    `);

    const task2 = pm.execAsync(async (instance) => {
      expect(instance).toBe(b);
      return await instance.execAsync(async () => {
        return await workloadB.promise;
      });
    });
    expect(pm.stats).toMatchInlineSnapshot(`
      {
        "free": Infinity,
        "queued": 0,
        "running": 2,
        "size": 3,
      }
    `);

    const task3 = pm.execAsync(async (instance) => {
      expect(instance).toBe(c);
      return await instance.execAsync(async () => {
        return await workloadC.promise;
      });
    });
    expect(pm.stats).toMatchInlineSnapshot(`
      {
        "free": Infinity,
        "queued": 0,
        "running": 3,
        "size": 3,
      }
    `);

    // Finish task for runner B
    workloadB.resolve('b:done');
    await expect(task2).resolves.toMatchInlineSnapshot(`"b:done"`);

    expect(pm.stats).toMatchInlineSnapshot(`
    {
      "free": Infinity,
      "queued": 0,
      "running": 2,
      "size": 3,
    }
  `);

    // Should be scheduled to worker b since it has 0 running tasks
    const task4 = pm.execAsync(async (instance) => {
      expect(instance).toBe(b);
      return await instance.execAsync(async () => {
        return await workloadD.promise;
      });
    });
    expect(pm.stats).toMatchInlineSnapshot(`
      {
        "free": Infinity,
        "queued": 0,
        "running": 3,
        "size": 3,
      }
    `);

    workloadA.resolve('a:done');
    workloadC.resolve('c:done');
    workloadD.resolve('d:done');

    await expect(task1).resolves.toMatchInlineSnapshot(`"a:done"`);
    await expect(task3).resolves.toMatchInlineSnapshot(`"c:done"`);
    await expect(task4).resolves.toMatchInlineSnapshot(`"d:done"`);
  });

  test('Instances with same load taken one by one', () => {
    const a = new PoolItemWithStatsMock('a');
    const b = new PoolItemWithStatsMock('b');
    const c = new PoolItemWithStatsMock('c');

    const pm = new BalancedRoundRobin(
      new Map([
        ['a', a],
        ['b', b],
        ['c', c],
      ]),
    );

    expect(pm.getNextItem().name).toMatchInlineSnapshot(`"a"`);
    expect(pm.getNextItem().name).toMatchInlineSnapshot(`"b"`);
    expect(pm.getNextItem().name).toMatchInlineSnapshot(`"c"`);
    expect(pm.getNextItem().name).toMatchInlineSnapshot(`"a"`);
  });
});
