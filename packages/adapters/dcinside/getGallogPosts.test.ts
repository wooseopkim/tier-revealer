import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, it, mock } from 'node:test';
import getGallogPosts from './getGallogPosts';

describe(getGallogPosts.name, () => {
  beforeEach(() => {
    const html = fs.readFileSync(
      path.resolve(path.dirname(import.meta.url.replace(/^file:/, '')), 'gallog.testdata.html'),
    );
    mock.method(globalThis, 'fetch', () => new Response(html));
  });

  it('fetches content', async () => {
    const res = await getGallogPosts({ identificationCode: '' });

    assert.deepStrictEqual(res, [
      {
        galleryId: 'lolpet',
        galleryName: '전설이(롤토체스)',
        postTitle: '테스트',
        date: new Date(2024, 5 - 1, 25),
      },
      {
        galleryId: 'lolpet',
        galleryName: '전설이(롤토체스)',
        postTitle: '테스트',
        date: new Date(2024, 5 - 1, 25),
      },
    ]);
  });
});
