import { useCallback } from 'react';
import { extend } from '@pixi/react';
import { Container, Graphics, Text } from 'pixi.js';
import { WORLD_SIZE } from './world';

extend({ Container, Graphics, Text });

const MINOR_STEP = 500;
const MAJOR_STEP = 1000;

const range = (max: number, step: number): number[] =>
  Array.from({ length: Math.floor(max / step) + 1 }, (_, i) => i * step);

const LABELS = range(WORLD_SIZE.width, MAJOR_STEP).flatMap((x) =>
  range(WORLD_SIZE.height, MAJOR_STEP).map((y) => ({ x, y })),
);

const LABEL_STYLE = { fill: 0xffffff, fontSize: 18, fontFamily: 'monospace' };

export function DebugGrid() {
  const draw = useCallback((g: Graphics) => {
    const { width, height } = WORLD_SIZE;
    g.clear();

    for (const step of [MINOR_STEP, MAJOR_STEP]) {
      const style = { width: step === MAJOR_STEP ? 2 : 1, color: 0xffffff, alpha: step === MAJOR_STEP ? 0.35 : 0.12 };
      for (const x of range(width, step)) g.moveTo(x, 0).lineTo(x, height).stroke(style);
      for (const y of range(height, step)) g.moveTo(0, y).lineTo(width, y).stroke(style);
    }

    g.rect(0, 0, width, height).stroke({ width: 4, color: 0xffffff, alpha: 0.6 });
  }, []);

  return (
    <pixiContainer label="debug-grid">
      <pixiGraphics draw={draw} />
      {LABELS.map(({ x, y }) => (
        <pixiText key={`${x},${y}`} text={`${x},${y}`} x={x + 6} y={y + 6} style={LABEL_STYLE} />
      ))}
    </pixiContainer>
  );
}
