import { describe, expect, it } from 'vitest';
import { INITIAL_PLAYER_POSITION, computeWorldOffset } from './world';

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
