import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import getGallogPosts from './getGallogPosts';

describe(getGallogPosts, () => {
  beforeEach(() => {
    const html = fs.readFileSync(
      path.resolve(path.dirname(import.meta.url.replace(/^file:/, '')), 'gallog.html'),
    );
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Response(html)),
    );
  });

  it('fetches content', async () => {
    const res = await getGallogPosts({ identificationCode: '' });

    expect(res).toEqual([
      {
        galleryName: '전설이(롤토체스)',
        postTitle: '테스트',
        date: new Date('2024-05-24T15:00:00Z'),
      },
      {
        galleryName: '전설이(롤토체스)',
        postTitle: '테스트',
        date: new Date('2024-05-24T15:00:00Z'),
      },
    ]);
  });
});
