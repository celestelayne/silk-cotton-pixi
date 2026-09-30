export type Asset = {
    id: string;
    src: string;
    tags: readonly string[];
    // Default display width in world px.
    width: number
};

export const ASSETS: readonly Asset[] = [
    {
        id: 'dithered-figures',
        src: '/images/dithered-image-2026-09-30-monochrome-blue-noise.png',
        tags: ['figure', 'portrait', 'dithered'],
        width: 500
    },
    {
        id: 'dithered-woman-cocoa',
        src: '/images/dithered-image-2026-09-30-monochrome-blue-noise-02.png',
        tags: ['labor', 'figure', 'cocoa', 'trinidad', 'dithered'],
        width: 500
    },
    {
        id: 'dithered-oxen-sugar-cane',
        src: '/images/dithered-image-2026-09-30-monochrome-blue-noise-03.png',
        tags: ['labor', 'animals', 'sugar-cane', 'barbados', 'dithered'],
        width: 900
    },
    {
        id: 'dithered-ship',
        src: '/images/dithered-Fatel_Razack_Madras.png',
        tags: ['ship', 'sea', 'madras', 'dithered'],
        width: 800
    }
];
