import type { Point, View } from './types';

export const MIN_ZOOM = 0.15;
export const MAX_ZOOM = 4;

const clampZoom = (zoom: number): number => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom));

export const panBy = (view: View, dx: number, dy: number): View => ({
  ...view,
  x: view.x + dx,
  y: view.y + dy,
});

// Scale by `factor` while keeping the world point under `anchor` (screen px) fixed.
export const zoomAt = (view: View, anchor: Point, factor: number): View => {
  const zoom = clampZoom(view.zoom * factor);
  const k = zoom / view.zoom;
  return {
    zoom,
    x: anchor.x - (anchor.x - view.x) * k,
    y: anchor.y - (anchor.y - view.y) * k,
  };
};
