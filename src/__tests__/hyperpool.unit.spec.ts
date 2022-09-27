import { describe, expect, test } from '@jest/globals';

import { BalancedRoundRobin, RoundRobin } from '../pools';

import { PoolItemWithLoadMock } from './PoolItemWithLoad.mock';

describe('Hyperpool', () => {
  test('Hierarchical pools', () => {
    const poolA = new BalancedRoundRobin(
      new Map([
        ['A:a', new PoolItemWithLoadMock('A:a', 6)],
        ['A:b', new PoolItemWithLoadMock('A:b', 3)],
        ['A:c', new PoolItemWithLoadMock('A:c', 5)],
      ]),
    );
    const poolB = new BalancedRoundRobin(
      new Map([
        ['B:a', new PoolItemWithLoadMock('B:a', 6)],
        ['B:b', new PoolItemWithLoadMock('B:b', 3)],
        ['B:c', new PoolItemWithLoadMock('B:c', 5)],
      ]),
    );
    const poolC = new RoundRobin(
      new Map([
        ['A', poolA],
        ['B', poolB],
      ]),
    );

    expect(poolC.getNextItem().getNextItem()).toMatchObject({ name: 'A:a', load: 6 });
    expect(poolC.getNextItem().getNextItem()).toMatchObject({ name: 'B:a', load: 6 });
    expect(poolC.getNextItem().getNextItem()).toMatchObject({ name: 'A:b', load: 3 });
    expect(poolC.getNextItem().getNextItem()).toMatchObject({ name: 'B:b', load: 3 });
    expect(poolC.getNextItem().getNextItem()).toMatchObject({ name: 'A:c', load: 5 });
    expect(poolC.getNextItem().getNextItem()).toMatchObject({ name: 'B:c', load: 5 });
    expect(poolC.getNextItem().getNextItem()).toMatchObject({ name: 'A:b', load: 3 });
    expect(poolC.getNextItem().getNextItem()).toMatchObject({ name: 'B:b', load: 3 });
  });
});
