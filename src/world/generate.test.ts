import { describe, expect, it } from 'vitest';
import { ASSETS, type Asset } from './assets';
import { SLOTS, generate } from './generate';
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

  it('places one item per slot that has a matching asset, in slot order', () => {
    const asset = (id: string, tag: string): Asset => ({ id, src: `/images/${id}.png`, tags: [tag], width: 100, aspect: 1 });
    const assets = [asset('c', 'cloud'), asset('fl', 'flora'), asset('fa', 'fauna'), asset('p1', 'figure'), asset('p2', 'figure')];
    const items = generate(1, { assets });
    expect(items.map((i) => i.assetId.replace(/\d$/, ''))).toEqual(['c', 'fl', 'fa', 'p']);
  });

  it('skips slots that have no matching asset', () => {
    const onlyFauna: Asset[] = [{ id: 'fa', src: '/images/fa.png', tags: ['fauna'], width: 100, aspect: 1 }];
    expect(generate(1, { assets: onlyFauna }).map((i) => i.assetId)).toEqual(['fa']);
  });

  it('with the real catalog places a cloud, a fauna and a figure (no flora asset yet)', () => {
    for (let seed = 0; seed < 50; seed++) {
      const tags = generate(seed).map((item) => SLOTS.find((slot) => ASSETS.find((a) => a.id === item.assetId)!.tags.includes(slot)));
      expect(tags).toEqual(['cloud', 'fauna', 'figure']);
    }
  });

  it('never overhangs the world border by more than EDGE_MARGIN', () => {
    for (let seed = 0; seed < 300; seed++) {
      for (const item of generate(seed)) {
        const b = bounds(item);
        expect(b.left).toBeGreaterThanOrEqual(-EDGE_MARGIN);
        expect(b.top).toBeGreaterThanOrEqual(-EDGE_MARGIN);
        expect(b.right).toBeLessThanOrEqual(WORLD_SIZE.width + EDGE_MARGIN);
        expect(b.bottom).toBeLessThanOrEqual(WORLD_SIZE.height + EDGE_MARGIN);
      }
    }
  });

  it('returns nothing when no asset matches a slot', () => {
    const unrelated: Asset[] = [{ id: 'x', src: '/images/x.png', tags: ['ship'], width: 100, aspect: 1 }];
    expect(generate(1, { assets: unrelated })).toEqual([]);
  });
});
