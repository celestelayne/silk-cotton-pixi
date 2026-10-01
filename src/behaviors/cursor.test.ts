import { describe, expect, it } from 'vitest';
import {
  CURIOUS_RADIUS,
  MAX_PARALLAX,
  STANDOFF,
  curiousStep,
  easeToward,
  normalizedCursor,
  parallaxTarget,
} from './cursor';

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

describe('normalizedCursor', () => {
  const vp = { width: 1000, height: 800 };

  it('is 0,0 at the viewport center', () => {
    expect(normalizedCursor({ x: 500, y: 400 }, vp)).toEqual({ x: 0, y: 0 });
  });

  it('is -1..1 at the edges and clamped beyond them', () => {
    expect(normalizedCursor({ x: 0, y: 0 }, vp)).toEqual({ x: -1, y: -1 });
    expect(normalizedCursor({ x: 5000, y: 5000 }, vp)).toEqual({ x: 1, y: 1 });
  });
});

describe('parallaxTarget', () => {
  it('is zero with no cursor, at the center, or at depth 0', () => {
    expect(parallaxTarget(1, null)).toEqual({ x: 0, y: 0 });
    expect(parallaxTarget(1, { x: 0, y: 0 })).toEqual({ x: 0, y: 0 });
    expect(parallaxTarget(0, { x: 1, y: 1 }).x).toBeCloseTo(0);
  });

  it('moves against the cursor, scaled by depth', () => {
    expect(parallaxTarget(1, { x: 1, y: -1 })).toEqual({ x: -MAX_PARALLAX, y: MAX_PARALLAX });
    expect(parallaxTarget(0.5, { x: 1, y: 0 }).x).toBeCloseTo(-MAX_PARALLAX / 2);
  });
});

describe('easeToward', () => {
  it('approaches the target without overshooting and does not move at dt 0', () => {
    const from = { x: 0, y: 0 };
    const to = { x: 100, y: 0 };
    expect(easeToward(from, to, 5, 0)).toEqual(from);
    const next = easeToward(from, to, 5, 0.1);
    expect(next.x).toBeGreaterThan(0);
    expect(next.x).toBeLessThan(100);
  });
});

describe('curiousStep', () => {
  const home = { x: 1000, y: 1000 };

  it('moves toward a cursor within the radius', () => {
    const cursor = { x: 1300, y: 1000 };
    const next = curiousStep(home, home, cursor, 0.016);
    expect(dist(next, cursor)).toBeLessThan(dist(home, cursor));
  });

  it('ignores a cursor outside the radius and returns home', () => {
    const away = { x: 1000 + CURIOUS_RADIUS + 2000, y: 1000 };
    expect(curiousStep(home, home, away, 0.5)).toEqual(home);
    const displaced = { x: 1200, y: 1000 };
    expect(dist(curiousStep(displaced, home, away, 0.1), home)).toBeLessThan(dist(displaced, home));
  });

  it('returns home when the cursor disappears (null)', () => {
    const displaced = { x: 1200, y: 1000 };
    expect(dist(curiousStep(displaced, home, null, 0.1), home)).toBeLessThan(dist(displaced, home));
  });

  it('never closes in past the standoff distance', () => {
    const cursor = { x: 1300, y: 1000 };
    let pos = home;
    for (let i = 0; i < 600; i++) pos = curiousStep(pos, home, cursor, 0.016);
    expect(dist(pos, cursor)).toBeGreaterThanOrEqual(STANDOFF - 1);
    expect(dist(pos, cursor)).toBeLessThan(STANDOFF + 5);
  });

  it('does not exceed the speed cap in one step', () => {
    const cursor = { x: 1000 + CURIOUS_RADIUS - 10, y: 1000 };
    const next = curiousStep(home, home, cursor, 0.05);
    expect(dist(next, home)).toBeLessThanOrEqual(500 * 0.05 + 1e-9);
  });

  it('does not move at dt 0', () => {
    expect(curiousStep(home, home, { x: 1300, y: 1000 }, 0)).toEqual(home);
  });
});
