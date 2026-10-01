import { describe, expect, it } from 'vitest';
import { EDGE_MARGIN, INITIAL_PLAYER_POSITION, WORLD_SIZE, centerRange, clampCenter, computeWorldOffset } from './world';

describe('computeWorldOffset', () => {
  it('centers the focus point in the viewport', () => {
    expect(computeWorldOffset({ width: 1440, height: 900 }, INITIAL_PLAYER_POSITION)).toEqual({
      x: -1280,
      y: -750,
    });
  });

  it('is zero when the focus is already the viewport center', () => {
    expect(computeWorldOffset({ width: 800, height: 600 }, { x: 400, y: 300 })).toEqual({ x: 0, y: 0 });
  });
});

describe('centerRange', () => {
  it('lets an item overhang by at most EDGE_MARGIN on each side', () => {
    const [min, max] = centerRange(1000, 200);
    expect(min - 100).toBe(-EDGE_MARGIN); // left edge
    expect(max + 100).toBe(1000 + EDGE_MARGIN); // right edge
  });
});

describe('clampCenter', () => {
  const size = { width: 300, height: 200 };

  it('leaves a center that is already in range alone', () => {
    expect(clampCenter({ x: 2000, y: 1200 }, size)).toEqual({ x: 2000, y: 1200 });
  });

  it('pulls a far-out center back to the margin limit', () => {
    const c = clampCenter({ x: -9999, y: 9999 }, size);
    expect(c.x - size.width / 2).toBe(-EDGE_MARGIN);
    expect(c.y + size.height / 2).toBe(WORLD_SIZE.height + EDGE_MARGIN);
  });
});
