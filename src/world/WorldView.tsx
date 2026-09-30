import { useRef } from 'react';
import { DebugHud } from '../DebugHud';
import { usePanZoom } from './usePanZoom';
import { ASSETS } from './assets';
import { useViewportSize } from './useViewportSize';
import type { Point, View } from './types';
import { INITIAL_PLAYER_POSITION, WORLD_SIZE, computeWorldOffset } from './world';

const line = (alpha: number, px: number, dir: 'right' | 'bottom') =>
  `linear-gradient(to ${dir}, rgba(255,255,255,${alpha}) ${px}px, transparent ${px}px)`;

// Debug grid: faint every 500, brighter every 1000 (world px).
const GRID = {
  backgroundImage: [line(0.35, 2, 'right'), line(0.35, 2, 'bottom'), line(0.12, 1, 'right'), line(0.12, 1, 'bottom')].join(','),
  backgroundSize: '1000px 1000px, 1000px 1000px, 500px 500px, 500px 500px',
};

// Temporary hand placement until generation (milestone 03).
const PLACEMENTS: Record<string, Point> = {
  'dithered-figures': { x: 2000, y: 1200 },
  'dithered-oxen-sugar-cane': { x: 1100, y: 1500 },
  'dithered-woman-cocoa': { x: 2900, y: 900 },
  'dithered-ship': { x: 2900, y: 1850 },
  'dithered-birdwing': { x: 1700, y: 800 },
};

const initialView = (): View => {
  const { x, y } = computeWorldOffset(
    { width: window.innerWidth, height: window.innerHeight },
    INITIAL_PLAYER_POSITION,
  );
  return { x, y, zoom: 1 };
};

export function WorldView() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const view = usePanZoom(viewportRef, initialView);
  const viewport = useViewportSize();

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
        {ASSETS.map((asset) => {
          const at = PLACEMENTS[asset.id];
          return (
            <img
              key={asset.id}
              src={asset.src}
              alt=""
              draggable={false}
              className="absolute"
              style={{
                left: at.x,
                top: at.y,
                width: asset.width,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}
      </div>
    </div>
    <DebugHud viewport={viewport} view={view} />
    </>
  );
}
