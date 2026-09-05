import { describe, it, expect } from 'vitest';
import { computeAggregate } from './aggregate';

describe('computeAggregate', () => {
  it('returns undefined average and 0 count for no ratings', () => {
    expect(computeAggregate([])).toEqual({ average: undefined, count: 0 });
  });

  it('averages and rounds to 1 decimal', () => {
    expect(computeAggregate([5, 5, 5])).toEqual({ average: 5, count: 3 });
    expect(computeAggregate([5, 4, 4])).toEqual({ average: 4.3, count: 3 });
    expect(computeAggregate([1, 2])).toEqual({ average: 1.5, count: 2 });
  });

  it('does not let one vote read as a precise average beyond its own value', () => {
    expect(computeAggregate([5])).toEqual({ average: 5, count: 1 });
  });
});
