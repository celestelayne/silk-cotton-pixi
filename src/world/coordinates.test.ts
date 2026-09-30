import { describe, expect, it } from 'vitest';
import { MAX_ZOOM, MIN_ZOOM, panBy, zoomAt } from './coordinates';
import type { View } from './types';

const view: View = { x: -1000, y: -500, zoom: 1 };
const toWorld = (v: View, p: { x: number; y: number }) => ({
  x: (p.x - v.x) / v.zoom,
  y: (p.y - v.y) / v.zoom,
});

describe('panBy', () => {
  it('shifts by the delta and keeps zoom', () => {
    expect(panBy(view, 30, -20)).toEqual({ x: -970, y: -520, zoom: 1 });
  });
});

describe('zoomAt', () => {
  it('keeps the world point under the anchor fixed', () => {
    const anchor = { x: 400, y: 300 };
    const next = zoomAt(view, anchor, 1.5);
    const before = toWorld(view, anchor);
    const after = toWorld(next, anchor);
    expect(next.zoom).toBeCloseTo(1.5);
    expect(after.x).toBeCloseTo(before.x);
    expect(after.y).toBeCloseTo(before.y);
  });

  it('clamps to MAX_ZOOM and MIN_ZOOM', () => {
    expect(zoomAt(view, { x: 0, y: 0 }, 100).zoom).toBe(MAX_ZOOM);
    expect(zoomAt(view, { x: 0, y: 0 }, 0.0001).zoom).toBe(MIN_ZOOM);
  });

  it('does not move the pan when already at a limit', () => {
    const atMax: View = { x: -1000, y: -500, zoom: MAX_ZOOM };
    expect(zoomAt(atMax, { x: 400, y: 300 }, 2)).toEqual(atMax);
  });

  it('anchors correctly when the factor is clamped', () => {
    const anchor = { x: 400, y: 300 };
    const next = zoomAt({ ...view, zoom: 3 }, anchor, 10);
    const before = toWorld({ ...view, zoom: 3 }, anchor);
    const after = toWorld(next, anchor);
    expect(next.zoom).toBe(MAX_ZOOM);
    expect(after.x).toBeCloseTo(before.x);
    expect(after.y).toBeCloseTo(before.y);
  });
});
