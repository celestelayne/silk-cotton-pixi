import type { View, WorldSize } from './world/types';
import { WORLD_SIZE } from './world/world';

type Props = { viewport: WorldSize; view: View };

const round = (n: number) => Math.round(n);

export function DebugHud({ viewport, view }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 8,
        left: 8,
        padding: '6px 10px',
        background: 'rgba(0, 0, 0, 0.6)',
        color: '#fff',
        font: '12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      <div>world: {WORLD_SIZE.width} × {WORLD_SIZE.height}</div>
      <div>view: {viewport.width} × {viewport.height}</div>
      <div>pan: ({round(view.x)}, {round(view.y)})</div>
      <div>zoom: {view.zoom.toFixed(2)}</div>
    </div>
  );
}
