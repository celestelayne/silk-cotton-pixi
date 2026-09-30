/// <reference types="node" />
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ASSETS } from './assets';

const IMAGE_SRC = /^\/images\/[^/]+\.(png|jpe?g|gif|webp|svg)$/i;
const TAG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

describe('ASSETS', () => {
  it('is not empty', () => {
    expect(ASSETS.length).toBeGreaterThan(0);
  });

  it('has unique ids', () => {
    const ids = ASSETS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(ASSETS.map((a) => [a.id, a] as const))('%s is well-formed', (_id, asset) => {
    expect(asset.src).toMatch(IMAGE_SRC);
    expect(asset.width).toBeGreaterThan(0);
    expect(asset.tags.length).toBeGreaterThan(0);
    for (const tag of asset.tags) expect(tag).toMatch(TAG);
  });

  it.each(ASSETS.map((a) => [a.id, a.src] as const))('%s file exists in public/', (_id, src) => {
    expect(existsSync(join(process.cwd(), 'public', src))).toBe(true);
  });
});
