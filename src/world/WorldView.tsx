import { useEffect, useMemo, useRef } from 'react';
import { DebugHud } from '../DebugHud';
import { useCursor } from './useCursor';
import { useCursorMotion } from './useCursorMotion';
import { usePanZoom } from './usePanZoom';
import { assetById } from './assets';
import { constrainView } from './coordinates';
import { generate } from './generate';
import { resolveSeed } from './random';
import { useViewportSize } from './useViewportSize';
import type { View } from './types';
import { EDGE_MARGIN, INITIAL_PLAYER_POSITION, WORLD_SIZE, computeWorldOffset } from './world';

const line = (alpha: number, px: number, dir: 'right' | 'bottom') =>
  `linear-gradient(to ${dir}, rgba(255,255,255,${alpha}) ${px}px, transparent ${px}px)`;

// Debug grid: faint every 500, brighter every 1000 (world px).
const GRID = {
  backgroundImage: [line(0.35, 2, 'right'), line(0.35, 2, 'bottom'), line(0.12, 1, 'right'), line(0.12, 1, 'bottom')].join(','),
  backgroundSize: '1000px 1000px, 1000px 1000px, 500px 500px, 500px 500px',
};

const initialView = (): View => {
  const viewport = { width: window.innerWidth, height: window.innerHeight };
  const { x, y } = computeWorldOffset(viewport, INITIAL_PLAYER_POSITION);
  return constrainView({ x, y, zoom: 1 }, viewport, WORLD_SIZE, EDGE_MARGIN);
};

export function WorldView() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const view = usePanZoom(viewportRef, initialView);
  const viewport = useViewportSize();
  const seed = useMemo(() => resolveSeed(window.location.search), []);
  const items = useMemo(() => generate(seed), [seed]);

  const viewRef = useRef(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);
  const cursorRef = useCursor(viewportRef);
  const elementRefs = useRef<(HTMLElement | null)[]>([]);
  useCursorMotion({ items, elements: elementRefs, view: viewRef, cursor: cursorRef, viewport: viewportRef });

  return (
    <>
    <div
      ref={viewportRef}
      className="fixed inset-0 overflow-hidden touch-none select-none cursor-grab active:cursor-grabbing bg-[#1e1e1e]"
    >
      <div
        className="absolute left-0 top-0 bg-[#2d3a4a] outline outline-4 outline-white/60"
        style={{
          width: WORLD_SIZE.width,
          height: WORLD_SIZE.height,
          transformOrigin: '0 0',
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
          ...GRID,
        }}
      >
        {items.map((item, i) => {
          const asset = assetById(item.assetId);
          if (!asset) return null;
          return (
            <img
              key={i}
              ref={(node) => {
                elementRefs.current[i] = node;
              }}
              src={asset.src}
              alt=""
              draggable={false}
              className="absolute"
              style={{
                left: item.x,
                top: item.y,
                width: item.width,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}
      </div>
    </div>
    <DebugHud viewport={viewport} view={view} seed={seed} />
    </>
  );
}
