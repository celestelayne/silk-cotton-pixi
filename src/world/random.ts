export type Rng = () => number;

// mulberry32: small, fast, deterministic. Returns floats in [0, 1).
export const createRng = (seed: number): Rng => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// Inclusive on both ends.
export const randInt = (rng: Rng, min: number, max: number): number =>
  min + Math.floor(rng() * (max - min + 1));

export const chance = (rng: Rng, probability: number): boolean => rng() < probability;

export const pick = <T>(rng: Rng, items: readonly T[]): T => items[randInt(rng, 0, items.length - 1)];

// FNV-1a, so any string can be a seed.
const hashString = (text: string): number => {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
};

// `?seed=` override when present (numbers are used as-is, other text is hashed); otherwise random.
export const resolveSeed = (search: string): number => {
  const raw = new URLSearchParams(search).get('seed');
  if (raw === null || raw === '') return Math.floor(Math.random() * 4294967296);
  return /^\d+$/.test(raw) ? Number(raw) >>> 0 : hashString(raw);
};
