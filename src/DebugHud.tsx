import { INITIAL_PLAYER_POSITION, WORLD_SIZE } from './world/world';

export function DebugHud() {
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
      <div>player: ({INITIAL_PLAYER_POSITION.x}, {INITIAL_PLAYER_POSITION.y})</div>
    </div>
  );
}
