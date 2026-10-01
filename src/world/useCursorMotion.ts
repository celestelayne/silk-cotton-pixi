import { useEffect, type RefObject } from 'react';
import {
  CURIOUS_SLOTS,
  DEPTH_BY_SLOT,
  PARALLAX_RATE,
  curiousStep,
  easeToward,
  normalizedCursor,
  parallaxTarget,
} from '../behaviors/cursor';
import { assetById } from './assets';
import type { PlacedItem, Point, View } from './types';
import { clampCenter } from './world';

type Args = {
  items: readonly PlacedItem[];
  elements: RefObject<(HTMLElement | null)[]>;
  view: RefObject<View>;
  cursor: RefObject<Point | null>;
  viewport: RefObject<HTMLElement | null>;
};

// Moves items in response to the cursor each frame by writing their transforms directly,
// so React does not re-render. Does nothing under prefers-reduced-motion.
export function useCursorMotion({ items, elements, view, cursor, viewport }: Args): void {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sizes = items.map((item) => ({
      width: item.width,
      height: item.width * (assetById(item.assetId)?.aspect ?? 1),
    }));
    // Curious items track an absolute position; parallax items track an offset from home.
    const state = items.map((item) => ({ pos: { x: item.x, y: item.y }, shift: { x: 0, y: 0 } }));

    let last = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const v = view.current;
      const screen = cursor.current;
      const el = viewport.current;
      const cursorWorld = screen && v ? { x: (screen.x - v.x) / v.zoom, y: (screen.y - v.y) / v.zoom } : null;
      const norm = screen && el ? normalizedCursor(screen, { width: el.clientWidth, height: el.clientHeight }) : null;

      items.forEach((item, i) => {
        const node = elements.current[i];
        if (!node) return;
        const s = state[i];
        const home = { x: item.x, y: item.y };

        let center = home;
        if (CURIOUS_SLOTS.includes(item.slot)) {
          s.pos = curiousStep(s.pos, home, cursorWorld, dt);
          center = s.pos;
        } else if (item.slot in DEPTH_BY_SLOT) {
          s.shift = easeToward(s.shift, parallaxTarget(DEPTH_BY_SLOT[item.slot], norm), PARALLAX_RATE, dt);
          center = { x: home.x + s.shift.x, y: home.y + s.shift.y };
        }

        const at = clampCenter(center, sizes[i]);
        node.style.transform = `translate(${at.x - home.x}px, ${at.y - home.y}px) translate(-50%, -50%)`;
      });

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [items, elements, view, cursor, viewport]);
}
