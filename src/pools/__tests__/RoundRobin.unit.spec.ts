import { describe, expect, test } from '@jest/globals';

import { PoolItemMock } from '../../__tests__/PoolItemMock.mock';
import { RoundRobin } from '../RoundRobin';

describe('Simple round-robin', () => {
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

    expect(pm.getNextItem()).toMatchObject({ name: 'a' });
    expect(pm.getNextItem()).toMatchObject({ name: 'b' });
    expect(pm.getNextItem()).toMatchObject({ name: 'c' });
    expect(pm.getNextItem()).toMatchObject({ name: 'a' });
  });
});
