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
