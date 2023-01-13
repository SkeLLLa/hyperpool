/* eslint-disable jest/no-commented-out-tests */
import { describe, expect, jest, test } from '@jest/globals';

import { PoolItemMock } from '../../__tests__/PoolItemMock.mock';
import { HashRandomPool } from '../HashRandom';

describe('Hash Random pool', () => {
  test('Get hash key from string', () => {
    const string = 'foobarbaz';
    expect(HashRandomPool.getHashKey(string)).toMatchInlineSnapshot(`7381240782615897000`);
    const string2 = 'foobar';
    expect(HashRandomPool.getHashKey(string2)).toMatchInlineSnapshot(`112628796121458`);
    const string3 = 'f';
    expect(HashRandomPool.getHashKey(string3)).toMatchInlineSnapshot(`102`);
  });

  test('Instances taken by fair random choice if no key supplied', () => {
    const a = new PoolItemMock('a');
    const b = new PoolItemMock('b');
    const c = new PoolItemMock('c');

    const pm = new HashRandomPool(
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

  test('Instances taken by key supplied', async () => {
    const a = new PoolItemMock('a');
    const b = new PoolItemMock('b');
    const c = new PoolItemMock('c');

    const pm = new HashRandomPool(
      new Map([
        ['a', a],
        ['b', b],
        ['c', c],
      ]),
    );

    expect(pm.getNextItem(0).name).toMatchInlineSnapshot(`"a"`);
    expect(pm.getNextItem(0).name).toMatchInlineSnapshot(`"a"`);
    expect(pm.getNextItem(3).name).toMatchInlineSnapshot(`"a"`);
  });
});
