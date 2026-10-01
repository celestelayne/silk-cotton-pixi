import { useEffect, useState, type RefObject } from 'react';
import { constrainView, fitZoom, panBy, zoomAt } from './coordinates';
import type { Point, View } from './types';
import { EDGE_MARGIN, WORLD_SIZE } from './world';

const WHEEL_SPEED = 0.002;
const PINCH_WHEEL_SPEED = 0.01; // ctrl+wheel is how trackpads report pinch

const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const midpoint = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

export function usePanZoom(ref: RefObject<HTMLElement | null>, initial: () => View): View {
  const [view, setView] = useState(initial);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const pointers = new Map<number, Point>();

    // Apply `update`, then keep the result inside the world (plus margin).
    const apply = (update: (v: View, minZoom: number) => View) => {
      const size = { width: el.clientWidth, height: el.clientHeight };
      const minZoom = fitZoom(size, WORLD_SIZE, EDGE_MARGIN);
      setView((v) => constrainView(update(v, minZoom), size, WORLD_SIZE, EDGE_MARGIN));
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const speed = e.ctrlKey ? PINCH_WHEEL_SPEED : WHEEL_SPEED;
      const anchor = { x: e.clientX, y: e.clientY };
      apply((v, minZoom) => zoomAt(v, anchor, Math.exp(-e.deltaY * speed), minZoom));
    };

    const onDown = (e: PointerEvent) => {
      el.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    };

    const onMove = (e: PointerEvent) => {
      const prev = pointers.get(e.pointerId);
      if (!prev) return;
      const next = { x: e.clientX, y: e.clientY };
      pointers.set(e.pointerId, next);

      if (pointers.size === 1) {
        apply((v) => panBy(v, next.x - prev.x, next.y - prev.y));
        return;
      }

      if (pointers.size === 2) {
        const other = [...pointers].find(([id]) => id !== e.pointerId)?.[1];
        if (!other) return;
        const before = midpoint(prev, other);
        const after = midpoint(next, other);
        const factor = distance(next, other) / Math.max(distance(prev, other), 1);
        apply((v, minZoom) => panBy(zoomAt(v, before, factor, minZoom), after.x - before.x, after.y - before.y));
      }
    };

    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
    };

    const onResize = () => apply((v) => v);

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    window.addEventListener('resize', onResize);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      window.removeEventListener('resize', onResize);
    };
  }, [ref]);

  return view;
}
