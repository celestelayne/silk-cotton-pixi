import type { Point, View, WorldSize } from './types';

export const MIN_ZOOM = 0.15;
export const MAX_ZOOM = 4;

const clamp = (n: number, min: number, max: number): number => Math.min(max, Math.max(min, n));

export const panBy = (view: View, dx: number, dy: number): View => ({
  ...view,
  x: view.x + dx,
  y: view.y + dy,
});

// Scale by `factor` while keeping the world point under `anchor` (screen px) fixed.
export const zoomAt = (view: View, anchor: Point, factor: number, minZoom = MIN_ZOOM): View => {
  const zoom = clamp(view.zoom * factor, minZoom, MAX_ZOOM);
  const k = zoom / view.zoom;
  return {
    zoom,
    x: anchor.x - (anchor.x - view.x) * k,
    y: anchor.y - (anchor.y - view.y) * k,
  };
};

// Smallest zoom at which the viewport still fits inside the world plus `margin` on every side.
export const fitZoom = (viewport: WorldSize, world: WorldSize, margin: number): number =>
  Math.max(viewport.width / (world.width + 2 * margin), viewport.height / (world.height + 2 * margin));

// Keep the visible region inside the world plus `margin`. If it is larger than that region on an
// axis, center it on that axis instead.
export const constrainView = (view: View, viewport: WorldSize, world: WorldSize, margin: number): View => {
  const zoom = clamp(view.zoom, fitZoom(viewport, world, margin), MAX_ZOOM);
  const axis = (pos: number, viewLength: number, worldLength: number): number => {
    const min = viewLength - (worldLength + margin) * zoom;
    const max = margin * zoom;
    return min > max ? (min + max) / 2 : clamp(pos, min, max);
  };
  return {
    zoom,
    x: axis(view.x, viewport.width, world.width),
    y: axis(view.y, viewport.height, world.height),
  };
};
