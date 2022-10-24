import { describe, expect, test } from '@jest/globals';
import defer from 'p-defer';

import { PoolItemMock } from '../../__tests__/PoolItemMock.mock';
import { RoundRobin } from '../RoundRobin';

describe('Round-robin pool', () => {
  test('Instances taken one by one', () => {
    const a = new PoolItemMock('a');
    const b = new PoolItemMock('b');
    const c = new PoolItemMock('c');

    const pm = new RoundRobin(
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

  test('Function is executed on valid instance', async () => {
    const a = new PoolItemMock('a');
    const b = new PoolItemMock('b');
    const c = new PoolItemMock('c');

    const pm = new RoundRobin(
      new Map([
        ['a', a],
        ['b', b],
        ['c', c],
      ]),
    );

    await expect(
      pm.execAsync((instance) => {
        return instance.name;
      }),
    ).resolves.toMatchInlineSnapshot(`"a"`);
    await expect(
      pm.execAsync((instance) => {
        return instance.name;
      }),
    ).resolves.toMatchInlineSnapshot(`"b"`);
    await expect(
      pm.execAsync((instance) => {
        return instance.name;
      }),
    ).resolves.toMatchInlineSnapshot(`"c"`);
    await expect(
      pm.execAsync((instance) => {
        return instance.name;
      }),
    ).resolves.toMatchInlineSnapshot(`"a"`);
  });

  test('Stats are caluclated', async () => {
    const workloadA = defer();
    const workloadB = defer();
    const workloadC = defer();
    const workloadD = defer();

    const a = new RoundRobin(new Map([['a', new PoolItemMock('a')]]));

    const task1 = a.execAsync(async () => {
      return workloadA.promise;
    });
    expect(a.stats).toMatchInlineSnapshot(`
      {
        "free": Infinity,
        "queued": 0,
        "running": 1,
        "size": 1,
      }
    `);
    const task2 = a.execAsync(async () => {
      return workloadB.promise;
    });
    const task3 = a.execAsync(async () => {
      return workloadC.promise;
    });
    expect(a.stats).toMatchInlineSnapshot(`
      {
        "free": Infinity,
        "queued": 0,
        "running": 3,
        "size": 1,
      }
    `);
    workloadB.resolve('b:done');
    await expect(task2).resolves.toMatchInlineSnapshot(`"b:done"`);
    expect(a.stats).toMatchInlineSnapshot(`
      {
        "free": Infinity,
        "queued": 0,
        "running": 2,
        "size": 1,
      }
    `);
    const task4 = a.execAsync(async () => {
      return workloadD.promise;
    });
    workloadA.resolve('a:done');
    workloadC.resolve('c:done');
    workloadD.resolve('d:done');

    await expect(task1).resolves.toMatchInlineSnapshot(`"a:done"`);
    await expect(task3).resolves.toMatchInlineSnapshot(`"c:done"`);
    await expect(task4).resolves.toMatchInlineSnapshot(`"d:done"`);
  });
});
