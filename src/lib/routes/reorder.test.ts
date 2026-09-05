import { describe, it, expect } from 'vitest';
import { moveUp, moveDown, moveTo } from './reorder';

describe('moveUp', () => {
  it('swaps an item with its predecessor', () => {
    expect(moveUp(['a', 'b', 'c'], 1)).toEqual(['b', 'a', 'c']);
  });

  it('is a no-op at the first index', () => {
    const items = ['a', 'b', 'c'];
    expect(moveUp(items, 0)).toEqual(items);
  });

  it('is a no-op for an out-of-range index', () => {
    const items = ['a', 'b', 'c'];
    expect(moveUp(items, -1)).toEqual(items);
    expect(moveUp(items, 5)).toEqual(items);
  });
});

describe('moveDown', () => {
  it('swaps an item with its successor', () => {
    expect(moveDown(['a', 'b', 'c'], 0)).toEqual(['b', 'a', 'c']);
  });

  it('is a no-op at the last index', () => {
    const items = ['a', 'b', 'c'];
    expect(moveDown(items, 2)).toEqual(items);
  });

  it('is a no-op for an out-of-range index', () => {
    const items = ['a', 'b', 'c'];
    expect(moveDown(items, -1)).toEqual(items);
    expect(moveDown(items, 5)).toEqual(items);
  });
});

describe('moveTo', () => {
  it('moves an item forward', () => {
    expect(moveTo(['a', 'b', 'c', 'd'], 0, 2)).toEqual(['b', 'c', 'a', 'd']);
  });

  it('moves an item backward', () => {
    expect(moveTo(['a', 'b', 'c', 'd'], 3, 1)).toEqual(['a', 'd', 'b', 'c']);
  });

  it('is a no-op when indices are equal', () => {
    const items = ['a', 'b', 'c'];
    expect(moveTo(items, 1, 1)).toEqual(items);
  });

  it('is a no-op for out-of-range indices', () => {
    const items = ['a', 'b', 'c'];
    expect(moveTo(items, -1, 1)).toEqual(items);
    expect(moveTo(items, 1, 9)).toEqual(items);
  });
});
