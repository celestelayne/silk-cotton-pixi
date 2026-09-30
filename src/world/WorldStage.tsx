import { Application, extend } from '@pixi/react';
import { Container } from 'pixi.js';
import { WORLD_SIZE } from './world';

extend({ Container });

export function WorldStage() {
  return (
    <Application
      resizeTo={window}
      background={0x1e1e1e}
    >
      <pixiContainer label="world" width={WORLD_SIZE.width} height={WORLD_SIZE.height} />
    </Application>
  );
}
