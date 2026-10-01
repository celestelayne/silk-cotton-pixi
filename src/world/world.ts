import type { Point, WorldSize } from './types';

export const WORLD_SIZE: WorldSize = { 
    width: 4000, 
    height: 2400 
};

export const INITIAL_PLAYER_POSITION: Point = { 
    x: 2000, 
    y: 1200 
};

// How far an item, or the viewport, may extend past the world border (world px).
export const EDGE_MARGIN = 60;

export const computeWorldOffset = (viewport: WorldSize, focus: Point): Point => ({
    x: viewport.width / 2 - focus.x,
    y: viewport.height / 2 - focus.y
});


// Range for an item's center along one axis, so it overhangs the border by at most EDGE_MARGIN.
export const centerRange = (worldLength: number, itemLength: number): [number, number] => [
    Math.ceil(itemLength / 2 - EDGE_MARGIN),
    Math.floor(worldLength - itemLength / 2 + EDGE_MARGIN)
];

export const clampCenter = (center: Point, size: WorldSize): Point => {
    const [minX, maxX] = centerRange(WORLD_SIZE.width, size.width);
    const [minY, maxY] = centerRange(WORLD_SIZE.height, size.height);
    return {
        x: Math.min(maxX, Math.max(minX, center.x)),
        y: Math.min(maxY, Math.max(minY, center.y))
    };
};
