import { useRef } from 'react';
import sample from '../assets/dithered-image-2026-09-30-monochrome-blue-noise.png';
import { DebugHud } from '../DebugHud';
import { usePanZoom } from './usePanZoom';
import { useViewportSize } from './useViewportSize';
import type { View } from './types';
import { INITIAL_PLAYER_POSITION, WORLD_SIZE, computeWorldOffset } from './world';

const line = (alpha: number, px: number, dir: 'right' | 'bottom') =>
  `linear-gradient(to ${dir}, rgba(255,255,255,${alpha}) ${px}px, transparent ${px}px)`;

// Debug grid: faint every 500, brighter every 1000 (world px).
const GRID = {
  backgroundImage: [line(0.35, 2, 'right'), line(0.35, 2, 'bottom'), line(0.12, 1, 'right'), line(0.12, 1, 'bottom')].join(','),
  backgroundSize: '1000px 1000px, 1000px 1000px, 500px 500px, 500px 500px',
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
        <img
          src={sample}
          alt=""
          draggable={false}
          className="absolute"
          style={{
            left: INITIAL_PLAYER_POSITION.x,
            top: INITIAL_PLAYER_POSITION.y,
            width: 500,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    </div>
    <DebugHud viewport={viewport} view={view} />
    </>
  );
}
