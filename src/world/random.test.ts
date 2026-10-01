import { describe, expect, it } from 'vitest';
import { DEFAULT_SEED, chance, createRng, pick, randInt, resolveSeed } from './random';

const sample = (seed: number, n = 5) => {
  const rng = createRng(seed);
  return Array.from({ length: n }, () => rng());
};

describe('createRng', () => {
  it('is deterministic for a seed', () => {
    expect(sample(42)).toEqual(sample(42));
  });

  it('differs between seeds', () => {
    expect(sample(1)).not.toEqual(sample(2));
  });

  it('stays within [0, 1)', () => {
    for (const n of sample(7, 1000)) {
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThan(1);
    }
  });
});

describe('randInt', () => {
  it('is inclusive on both ends and never leaves the range', () => {
    const rng = createRng(3);
    const seen = new Set<number>();
    for (let i = 0; i < 500; i++) {
      const n = randInt(rng, 2, 5);
      expect(n).toBeGreaterThanOrEqual(2);
      expect(n).toBeLessThanOrEqual(5);
      seen.add(n);
    }
    expect([...seen].sort()).toEqual([2, 3, 4, 5]);
  });

  it('returns the value when min equals max', () => {
    expect(randInt(createRng(1), 9, 9)).toBe(9);
  });
});

describe('chance', () => {
  it('is never true at 0 and always true at 1', () => {
    const rng = createRng(5);
    for (let i = 0; i < 200; i++) {
      expect(chance(rng, 0)).toBe(false);
      expect(chance(rng, 1)).toBe(true);
    }
  });
});

describe('pick', () => {
  it('only returns members of the list and can reach every member', () => {
    const items = ['a', 'b', 'c'] as const;
    const rng = createRng(11);
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) seen.add(pick(rng, items));
    expect([...seen].sort()).toEqual(['a', 'b', 'c']);
  });
});

describe('resolveSeed', () => {
  it('uses a numeric ?seed= as is', () => {
    expect(resolveSeed('?seed=12345')).toBe(12345);
  });

  it('hashes non-numeric text consistently', () => {
    expect(resolveSeed('?seed=silk-cotton')).toBe(resolveSeed('?seed=silk-cotton'));
    expect(resolveSeed('?seed=silk-cotton')).not.toBe(resolveSeed('?seed=another'));
  });

  it('falls back to DEFAULT_SEED when absent or empty', () => {
    for (const search of ['', '?other=1', '?seed=']) {
      expect(resolveSeed(search)).toBe(DEFAULT_SEED);
    }
  });
});
