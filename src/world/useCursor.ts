import { useEffect, useRef, type RefObject } from 'react';
import type { Point } from './types';

// Cursor position in screen px, or null. Only a hovering mouse or pen counts; touch is ignored.
// Stored in a ref so moving the pointer never re-renders.
export function useCursor(target: RefObject<HTMLElement | null>): RefObject<Point | null> {
  const cursor = useRef<Point | null>(null);

  useEffect(() => {
    const el = target.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      cursor.current = e.pointerType === 'touch' ? null : { x: e.clientX, y: e.clientY };
    };
    const clear = () => {
      cursor.current = null;
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', clear);
    el.addEventListener('pointercancel', clear);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', clear);
      el.removeEventListener('pointercancel', clear);
    };
  }, [target]);

  return cursor;
}
