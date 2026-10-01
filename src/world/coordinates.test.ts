import { describe, expect, it } from 'vitest';
import { MAX_ZOOM, MIN_ZOOM, constrainView, fitZoom, panBy, zoomAt } from './coordinates';
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

describe('zoomAt with a custom minimum', () => {
  it('stops at the given minZoom', () => {
    expect(zoomAt(view, { x: 0, y: 0 }, 0.0001, 0.5).zoom).toBe(0.5);
  });
});

const WORLD = { width: 4000, height: 2400 };
const MARGIN = 60;
const SCREEN = { width: 1000, height: 800 };

describe('fitZoom', () => {
  it('is the zoom at which the viewport exactly spans the world plus margin on the tighter axis', () => {
    // width: 1000 / 4120 = 0.2427, height: 800 / 2520 = 0.3175
    expect(fitZoom(SCREEN, WORLD, MARGIN)).toBeCloseTo(800 / 2520);
  });
});

describe('constrainView', () => {
  it('leaves a view that is already inside the bounds alone', () => {
    const inside: View = { x: -500, y: -300, zoom: 1 };
    expect(constrainView(inside, SCREEN, WORLD, MARGIN)).toEqual(inside);
  });

  it('stops the top-left at the margin', () => {
    const c = constrainView({ x: 500, y: 500, zoom: 1 }, SCREEN, WORLD, MARGIN);
    expect(c.x).toBe(MARGIN);
    expect(c.y).toBe(MARGIN);
  });

  it('stops the bottom-right at the margin', () => {
    const c = constrainView({ x: -99999, y: -99999, zoom: 1 }, SCREEN, WORLD, MARGIN);
    // visible right edge = (viewport.width - x) / zoom = world.width + margin
    expect((SCREEN.width - c.x) / c.zoom).toBe(WORLD.width + MARGIN);
    expect((SCREEN.height - c.y) / c.zoom).toBe(WORLD.height + MARGIN);
  });

  it('raises zoom to the fit zoom when zoomed out too far', () => {
    const c = constrainView({ x: 0, y: 0, zoom: 0.01 }, SCREEN, WORLD, MARGIN);
    expect(c.zoom).toBeCloseTo(fitZoom(SCREEN, WORLD, MARGIN));
  });

  it('caps zoom at MAX_ZOOM', () => {
    expect(constrainView({ x: 0, y: 0, zoom: 99 }, SCREEN, WORLD, MARGIN).zoom).toBe(MAX_ZOOM);
  });

  it('centers on an axis where the viewport is larger than the allowed region', () => {
    // A 5000-wide viewport is wider than the 4120-wide allowed region at fit zoom 1 on that axis.
    const wide = { width: 5000, height: 800 };
    const c = constrainView({ x: 0, y: 0, zoom: fitZoom(wide, WORLD, MARGIN) }, wide, WORLD, MARGIN);
    const visibleLeft = -c.x / c.zoom;
    const visibleRight = (wide.width - c.x) / c.zoom;
    expect(visibleLeft + visibleRight).toBeCloseTo(WORLD.width); // symmetric about the world center
  });
});
