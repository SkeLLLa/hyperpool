import { describe, expect, test } from '@jest/globals';

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
});
