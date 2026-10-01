export type Point = { 
    x: number; 
    y: number 
};

export type WorldSize = { 
    width: number; 
    height: number 
};


// Screen-space translation of the world plane, and its scale.
export type View = {
    x: number;
    y: number;
    zoom: number
};


export type PlacedItem = {
    assetId: string;
    // The generation slot this item filled (cloud, flora, fauna, figure).
    slot: string;
    // Center of the item, in world coordinates.
    x: number;
    y: number;
    // Display width in world px.
    width: number
};
