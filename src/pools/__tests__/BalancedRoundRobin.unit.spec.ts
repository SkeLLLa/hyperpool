import { describe, expect, test } from '@jest/globals';

import { PoolItemWithLoadMock } from '../../__tests__/PoolItemWithLoad.mock';
import { BalancedRoundRobin } from '../BalancedRoundRobin';

describe('Balanced round-robin', () => {
  test('Lowest load item taken first', () => {
    const a = new PoolItemWithLoadMock('a', 4);
    const b = new PoolItemWithLoadMock('b', 6);
    const c = new PoolItemWithLoadMock('c', 3);

    const pm = new BalancedRoundRobin(
      new Map([
        ['a', a],
        ['b', b],
        ['c', c],
      ]),
    );

    let item = pm.getNextItem();
    expect(item).toMatchObject({ name: 'a', load: 4 });
    item.increaseLoad();
    expect(pm.load).toMatchInlineSnapshot(`14`);

    item = pm.getNextItem();
    expect(item).toMatchObject({
      name: 'b',
      load: 6,
    });
    item.increaseLoad();
    expect(pm.load).toMatchInlineSnapshot(`15`);

    item = pm.getNextItem();
    expect(item).toMatchObject({
      name: 'c',
      load: 3,
    });
    item.increaseLoad();
    expect(pm.load).toMatchInlineSnapshot(`16`);

    item = pm.getNextItem();
    expect(item).toMatchObject({
      name: 'c',
      load: 4,
    });
    item.increaseLoad();
    expect(pm.load).toMatchInlineSnapshot(`17`);

    item = pm.getNextItem();
    expect(item).toMatchObject({
      name: 'a',
      load: 5,
    });
    item.increaseLoad();
    expect(pm.load).toMatchInlineSnapshot(`18`);

    item = pm.getNextItem();
    expect(item).toMatchObject({
      name: 'c',
      load: 5,
    });
    item.increaseLoad();
    expect(pm.load).toMatchInlineSnapshot(`19`);
  });

  test('Instances with same load taken one by one', () => {
    const a = new PoolItemWithLoadMock('a', 1);
    const b = new PoolItemWithLoadMock('b', 1);
    const c = new PoolItemWithLoadMock('c', 1);

    const pm = new BalancedRoundRobin(
      new Map([
        ['a', a],
        ['b', b],
        ['c', c],
      ]),
    );

    expect(pm.getNextItem()).toMatchObject({ name: 'a', load: 1 });
    expect(pm.getNextItem()).toMatchObject({ name: 'b', load: 1 });
    expect(pm.getNextItem()).toMatchObject({ name: 'c', load: 1 });
    expect(pm.getNextItem()).toMatchObject({ name: 'a', load: 1 });
  });
});
