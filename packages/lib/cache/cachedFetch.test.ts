import assert from 'node:assert';
import { beforeEach, describe, it, mock, type Mock } from 'node:test';
import cachedFetch from './cachedFetch';

describe(cachedFetch.name, () => {
  const params = [[{ name: 'foo' }, { ttl: 10 }], [{ url: '/foo', ttl: 20 }]] as Parameters<
    typeof cachedFetch
  >[];

  let cache: Partial<Cache>;

  beforeEach(() => {
    mock.method(globalThis, 'fetch', async () => new Response());

    cache = {
      match: mock.fn(async () => undefined),
      put: mock.fn(async () => {}),
    };
    const caches: Partial<CacheStorage> = {
      async open() {
        return cache as Cache;
      },
    };
    globalThis['caches'] = caches as CacheStorage;
  });

  params.forEach((args) =>
    it(`caches responses (${JSON.stringify(args)})`, async () => {
      const fetch = cachedFetch(...args);

      await fetch('https://example.com');

      const req = (cache.put as Mock<(typeof Cache)['prototype']['put']>).mock.calls[0]
        .arguments[0] as Request;
      assert.strictEqual(req.url, 'https://example.com/');
    }),
  );

  params.forEach((args) =>
    it(`does not cache errors (${JSON.stringify(args)})`, async () => {
      const fetch = cachedFetch(...args);

      mock.method(globalThis, 'fetch', async () => new Response('', { status: 500 }));
      await fetch('https://example.com');

      assert.strictEqual((cache.put as Mock<Cache['put']>).mock.callCount(), 0);
    }),
  );

  params.forEach((args) =>
    it(`does not cache POST responses (${JSON.stringify(args)})`, async () => {
      const fetch = cachedFetch(...args);

      await fetch('https://example.com', { method: 'POST' });

      assert.strictEqual((cache.put as Mock<Cache['put']>).mock.callCount(), 0);
      assert.strictEqual((cache.match as Mock<Cache['match']>).mock.callCount(), 0);
    }),
  );

  params.forEach((args) =>
    it(`returns cached response if any (${JSON.stringify(args)})`, async () => {
      const cached = new Response();
      mock.method(cache as Cache, 'match', async () => cached);
      const fetch = cachedFetch(...args);

      const res = await fetch('https://example.com');

      assert.strictEqual(res, cached);
    }),
  );

  params.forEach((args) =>
    it(`sets Cache-Control header if none (${JSON.stringify(args)})`, async () => {
      const fetch = cachedFetch(...args);

      const res = await fetch('https://example.com');

      const ttl = 'ttl' in args[0] ? args[0].ttl : (args as { ttl: number }[])[1]!.ttl;
      assert.strictEqual(res.headers.get('Cache-Control'), `max-age: ${ttl}`);
    }),
  );

  params.forEach((args) =>
    it(`sets Cache-Control header if none (${JSON.stringify(args)})`, async () => {
      mock.method(
        globalThis,
        'fetch',
        async () => new Response('', { headers: { 'Cache-Control': 'max-age: 1234' } }),
      );
      const fetch = cachedFetch(...args);

      const res = await fetch('https://example.com');

      const ttl = 'ttl' in args[0] ? args[0].ttl : (args as { ttl: number }[])[1]!.ttl;
      assert.notStrictEqual(res.headers.get('Cache-Control'), `max-age: ${ttl}`);
      assert.strictEqual(res.headers.get('Cache-Control'), 'max-age: 1234');
    }),
  );

  params.forEach((args) =>
    it(`caches each request with different headers (${JSON.stringify(args)})`, async () => {
      const fetch = cachedFetch(...args);

      mock.method(globalThis, 'fetch', async () => new Response('1'));
      const first = await fetch('https://example.com', {
        headers: {
          'X-Foo': 'Bar',
        },
      });
      mock.method(globalThis, 'fetch', async () => new Response('2'));
      const second = await fetch('https://example.com', {
        headers: {
          'X-Foo': 'Baz',
        },
      });

      const a = (cache.put as Mock<(typeof Cache)['prototype']['put']>).mock.calls[0]
        .arguments[0] as Request;
      const b = (cache.put as Mock<(typeof Cache)['prototype']['put']>).mock.calls[1]
        .arguments[0] as Request;
      assert.notDeepStrictEqual(new Map(a.headers.entries()), new Map(b.headers.entries()));
      assert.notStrictEqual(await first.text(), await second.text());
    }),
  );

  params.forEach((args) =>
    it(`fires fetch when cache missed (${JSON.stringify(args)})`, async () => {
      mock.method(globalThis, 'fetch');
      const fetch = cachedFetch(...args);

      await fetch('https://example.com');

      assert.strictEqual(
        Object.getPrototypeOf(
          (globalThis.fetch as Mock<typeof fetch>).mock.calls[0].arguments[0] as object,
        ),
        Request.prototype,
      );
      const req = (globalThis.fetch as Mock<typeof fetch>).mock.calls[0].arguments[0] as Request;
      assert.strictEqual(req.url, 'https://example.com/');
    }),
  );
});
