import type { Point, WorldSize } from './types';

export const WORLD_SIZE: WorldSize = { 
    width: 4000, 
    height: 2400 
};

export const INITIAL_PLAYER_POSITION: Point = { 
    x: 2000, 
    y: 1200 
};


export const computeWorldOffset = (viewport: WorldSize, focus: Point): Point => ({
    x: viewport.width / 2 - focus.x,
    y: viewport.height / 2 - focus.y
});
