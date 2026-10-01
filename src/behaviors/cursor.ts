import type { Point, WorldSize } from '../world/types';

// How far (world px) a depth-1 item shifts when the cursor is at the edge of the viewport.
export const MAX_PARALLAX = 60;
// Slots that shift against the cursor, and how much (0 = fixed background, 1 = nearest).
export const DEPTH_BY_SLOT: Readonly<Record<string, number>> = { cloud: 0.25, flora: 0.5, figure: 0.8 };
// Slots that are drawn toward the cursor.
export const CURIOUS_SLOTS: readonly string[] = ['fauna'];

export const CURIOUS_RADIUS = 600; // world px: only reacts when the cursor is this close
export const STANDOFF = 120; // world px: stops this far from the cursor instead of covering it
const CURIOUS_RATE = 2.5; // easing, per second
const MAX_SPEED = 500; // world px / second
export const PARALLAX_RATE = 5; // easing, per second

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

// Cursor position in -1..1 on each axis, relative to the viewport center.
export const normalizedCursor = (screen: Point, viewport: WorldSize): Point => ({
  x: clamp((screen.x - viewport.width / 2) / (viewport.width / 2), -1, 1),
  y: clamp((screen.y - viewport.height / 2) / (viewport.height / 2), -1, 1),
});

// Where a parallax item wants to sit relative to home. Items move against the cursor.
export const parallaxTarget = (depth: number, norm: Point | null): Point =>
  norm ? { x: 0 - norm.x * depth * MAX_PARALLAX, y: 0 - norm.y * depth * MAX_PARALLAX } : { x: 0, y: 0 };

// Exponential ease of `current` toward `target`, independent of frame rate.
export const easeToward = (current: Point, target: Point, rate: number, dt: number): Point => {
  const k = 1 - Math.exp(-rate * dt);
  return { x: current.x + (target.x - current.x) * k, y: current.y + (target.y - current.y) * k };
};

// One frame of "curious": drift toward a nearby cursor (stopping at STANDOFF), else return home.
export const curiousStep = (pos: Point, home: Point, cursor: Point | null, dt: number): Point => {
  let target = home;
  if (cursor) {
    const dx = cursor.x - pos.x;
    const dy = cursor.y - pos.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= CURIOUS_RADIUS) {
      target = dist <= STANDOFF ? pos : { x: cursor.x - (dx / dist) * STANDOFF, y: cursor.y - (dy / dist) * STANDOFF };
    }
  }

  const eased = easeToward(pos, target, CURIOUS_RATE, dt);
  const mx = eased.x - pos.x;
  const my = eased.y - pos.y;
  const step = Math.hypot(mx, my);
  const cap = MAX_SPEED * dt;
  if (step <= cap || step === 0) return eased;
  return { x: pos.x + (mx / step) * cap, y: pos.y + (my / step) * cap };
};
