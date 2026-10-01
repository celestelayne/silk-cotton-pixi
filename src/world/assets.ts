export type Asset = {
    id: string;
    src: string;
    tags: readonly string[];
    // Default display width in world px.
    width: number;
    // Natural height / width.
    aspect: number
};

export const ASSETS: readonly Asset[] = [
    {
        id: 'dithered-figures',
        src: '/images/dithered-image-2026-09-30-monochrome-blue-noise.png',
        tags: ['figure', 'portrait', 'dithered'],
        width: 500,
        aspect: 1483 / 1061
    },
    {
        id: 'dithered-woman-cocoa',
        src: '/images/dithered-image-2026-09-30-monochrome-blue-noise-02.png',
        tags: ['labor', 'figure', 'cocoa', 'trinidad', 'dithered'],
        width: 500,
        aspect: 1321 / 1191
    },
    {
        id: 'dithered-oxen-sugar-cane',
        src: '/images/dithered-image-2026-09-30-monochrome-blue-noise-03.png',
        tags: ['labor', 'animals', 'sugar-cane', 'barbados', 'dithered'],
        width: 900,
        aspect: 864 / 1821
    },
    {
        id: 'dithered-ship',
        src: '/images/dithered-Fatel_Razack_Madras.png',
        tags: ['ship', 'sea', 'madras', 'dithered'],
        width: 800,
        aspect: 1050 / 1498
    },
    {
        id: 'dithered-birdwing',
        src: '/images/dithered-common-green-birdwing.png',
        tags: ['butterfly', 'insect', 'fauna', 'dithered'],
        width: 300,
        aspect: 1086 / 1448
    }
];


export const assetById = (id: string): Asset | undefined => ASSETS.find((a) => a.id === id);
