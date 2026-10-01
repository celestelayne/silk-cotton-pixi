import { describe, expect, it } from 'vitest';
import { ASSETS, type Asset } from './assets';
import { GENERATED_TAGS, generate } from './generate';
import { EDGE_MARGIN, WORLD_SIZE } from './world';

const bounds = (item: ReturnType<typeof generate>[number]) => {
  const asset = ASSETS.find((a) => a.id === item.assetId)!;
  const height = item.width * asset.aspect;
  return {
    left: item.x - item.width / 2,
    right: item.x + item.width / 2,
    top: item.y - height / 2,
    bottom: item.y + height / 2,
  };
};

describe('generate', () => {
  it('is deterministic for a seed and differs between seeds', () => {
    expect(generate(42)).toEqual(generate(42));
    const results = new Set(Array.from({ length: 20 }, (_, s) => JSON.stringify(generate(s))));
    expect(results.size).toBeGreaterThan(1);
  });

  it('places one item by default and honors count', () => {
    expect(generate(1)).toHaveLength(1);
    expect(generate(1, { count: 4 })).toHaveLength(4);
  });

  it('only uses catalog assets tagged cloud, flora or fauna (no figures)', () => {
    for (let seed = 0; seed < 50; seed++) {
      for (const item of generate(seed, { count: 5 })) {
        const asset = ASSETS.find((a) => a.id === item.assetId);
        expect(asset).toBeDefined();
        expect(asset!.tags.some((t) => GENERATED_TAGS.includes(t))).toBe(true);
        expect(asset!.tags).not.toContain('figure');
      }
    }
  });

  it('never overhangs the world border by more than EDGE_MARGIN', () => {
    for (let seed = 0; seed < 300; seed++) {
      for (const item of generate(seed, { count: 3 })) {
        const b = bounds(item);
        expect(b.left).toBeGreaterThanOrEqual(-EDGE_MARGIN);
        expect(b.top).toBeGreaterThanOrEqual(-EDGE_MARGIN);
        expect(b.right).toBeLessThanOrEqual(WORLD_SIZE.width + EDGE_MARGIN);
        expect(b.bottom).toBeLessThanOrEqual(WORLD_SIZE.height + EDGE_MARGIN);
      }
    }
  });

  it('returns nothing when no asset is eligible', () => {
    const figureOnly: Asset[] = [{ id: 'f', src: '/images/f.png', tags: ['figure'], width: 100, aspect: 1 }];
    expect(generate(1, { assets: figureOnly })).toEqual([]);
  });
});
