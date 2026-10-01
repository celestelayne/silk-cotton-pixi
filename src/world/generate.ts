import { ASSETS, type Asset } from './assets';
import { createRng, pick, randInt } from './random';
import type { PlacedItem } from './types';
import { EDGE_MARGIN, WORLD_SIZE } from './world';

// Only these kinds of assets are generated for now; people and vessels are placed by hand later.
export const GENERATED_TAGS: readonly string[] = ['cloud', 'flora', 'fauna'];

type Options = {
  count?: number;
  assets?: readonly Asset[];
};

const isEligible = (asset: Asset) => asset.tags.some((tag) => GENERATED_TAGS.includes(tag));

// Center range that keeps the item no more than EDGE_MARGIN past the border.
const centerRange = (worldLength: number, itemLength: number): [number, number] => [
  Math.ceil(itemLength / 2 - EDGE_MARGIN),
  Math.floor(worldLength - itemLength / 2 + EDGE_MARGIN),
];

export function generate(seed: number, { count = 1, assets = ASSETS }: Options = {}): PlacedItem[] {
  const eligible = assets.filter(isEligible);
  if (eligible.length === 0) return [];

  const rng = createRng(seed);
  return Array.from({ length: count }, () => {
    const asset = pick(rng, eligible);
    const [minX, maxX] = centerRange(WORLD_SIZE.width, asset.width);
    const [minY, maxY] = centerRange(WORLD_SIZE.height, asset.width * asset.aspect);
    return {
      assetId: asset.id,
      x: randInt(rng, minX, maxX),
      y: randInt(rng, minY, maxY),
      width: asset.width,
    };
  });
}
