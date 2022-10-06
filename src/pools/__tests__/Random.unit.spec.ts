import { describe, expect, jest, test } from '@jest/globals';

import { PoolItemMock } from '../../__tests__/PoolItemMock.mock';
import { RoundRobin } from '../RoundRobin';

describe('Random pool', () => {
  test('Instances taken by fair random choice', () => {
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
    jest.spyOn(global.Math, 'random').mockReturnValue(0.1);
    expect(pm.getNextItem().name).toMatchInlineSnapshot(`"a"`);
    jest.spyOn(global.Math, 'random').mockReturnValue(0.4);
    expect(pm.getNextItem().name).toMatchInlineSnapshot(`"b"`);
    jest.spyOn(global.Math, 'random').mockReturnValue(0.8);
    expect(pm.getNextItem().name).toMatchInlineSnapshot(`"c"`);

    jest.spyOn(global.Math, 'random').mockRestore();
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

    const fn = jest.fn(() => {
      return Promise.resolve('done');
    });

    await expect(pm.execAsync(fn)).resolves.toBe('done');
    await expect(pm.execAsync(fn)).resolves.toBe('done');
    await expect(pm.execAsync(fn)).resolves.toBe('done');
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
