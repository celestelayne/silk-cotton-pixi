import { useCallback } from 'react';
import { Application, extend } from '@pixi/react';
import { Container, Graphics } from 'pixi.js';
import type { Point } from './types';
import { DebugGrid } from './DebugGrid';
import { INITIAL_PLAYER_POSITION, WORLD_SIZE } from './world';

extend({ Container, Graphics });

const PLAYER_RADIUS = 16;

type Props = { offset: Point };

export function WorldStage({ offset }: Props) {
  const drawBackground = useCallback((g: Graphics) => {
    g.clear().rect(0, 0, WORLD_SIZE.width, WORLD_SIZE.height).fill(0x2d3a4a);
  }, []);

  const drawPlayer = useCallback((g: Graphics) => {
    g.clear().circle(0, 0, PLAYER_RADIUS).fill(0xff5a4f);
  }, []);

  return (
    <Application resizeTo={window} background={0x1e1e1e}>
      <pixiContainer label="world" x={offset.x} y={offset.y}>
        <pixiGraphics label="background" x={0} y={0} draw={drawBackground} />
        <DebugGrid />
        <pixiGraphics
          label="player"
          x={INITIAL_PLAYER_POSITION.x}
          y={INITIAL_PLAYER_POSITION.y}
          draw={drawPlayer}
        />
      </pixiContainer>
    </Application>
  );
}
