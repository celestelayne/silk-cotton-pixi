import { ASSETS, type Asset } from './assets';
import { createRng, pick, randInt } from './random';
import type { PlacedItem } from './types';
import { EDGE_MARGIN, WORLD_SIZE } from './world';

// One item is placed per slot, in this order (later slots draw on top). A slot with no
// matching asset in the catalog is skipped.
export const SLOTS: readonly string[] = ['cloud', 'flora', 'fauna', 'figure'];

type Options = {
  assets?: readonly Asset[];
};

// Center range that keeps the item no more than EDGE_MARGIN past the border.
const centerRange = (worldLength: number, itemLength: number): [number, number] => [
  Math.ceil(itemLength / 2 - EDGE_MARGIN),
  Math.floor(worldLength - itemLength / 2 + EDGE_MARGIN),
];

export function generate(seed: number, { assets = ASSETS }: Options = {}): PlacedItem[] {
  const rng = createRng(seed);
  return SLOTS.flatMap((slot) => {
    const candidates = assets.filter((asset) => asset.tags.includes(slot));
    if (candidates.length === 0) return [];

    const asset = pick(rng, candidates);
    const [minX, maxX] = centerRange(WORLD_SIZE.width, asset.width);
    const [minY, maxY] = centerRange(WORLD_SIZE.height, asset.width * asset.aspect);
    return [
      {
        assetId: asset.id,
        x: randInt(rng, minX, maxX),
        y: randInt(rng, minY, maxY),
        width: asset.width,
      },
    ];
  });
}
