import { beforeEach, describe, expect, it, vi, type MockedFunction } from 'vitest';
import cachedFetch from './cachedFetch';

describe(cachedFetch, () => {
  const params = [[{ name: 'foo' }, { ttl: 10 }], [{ url: '/foo', ttl: 20 }]] as Parameters<
    typeof cachedFetch
  >[];

  let cache: Partial<Cache>;

  beforeEach(() => {
    vi.stubGlobal('fetch', async () => new Response());

    cache = {
      match: vi.fn(async () => undefined),
      put: vi.fn(async () => {}),
    };
    const caches: Partial<CacheStorage> = {
      async open() {
        return cache as Cache;
      },
    };
    vi.stubGlobal('caches', caches);
  });

  it.each(params)('caches responses', async (...args) => {
    const fetch = cachedFetch(...args);

    await fetch('https://example.com');

    const req = (cache.put as MockedFunction<(typeof Cache)['prototype']['put']>).mock
      .calls[0][0] as Request;
    expect(req.url).toBe('https://example.com/');
  });

  it.each(params)('does not cache errors', async (...args) => {
    const fetch = cachedFetch(...args);

    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response('', { status: 500 }));
    await fetch('https://example.com');

    expect(cache.put).not.toHaveBeenCalled();
  });

  it.each(params)('does not cache POST responses', async (...args) => {
    const fetch = cachedFetch(...args);

    await fetch('https://example.com', { method: 'POST' });

    expect(cache.match).not.toHaveBeenCalled();
    expect(cache.put).not.toHaveBeenCalled();
  });

  it.each(params)('returns cached response if any', async (...args) => {
    const cached = new Response();
    vi.spyOn(cache, 'match').mockImplementation(async () => cached);
    const fetch = cachedFetch(...args);

    const res = await fetch('https://example.com');

    expect(res).toBe(cached);
  });

  it.each(params)('sets Cache-Control header if none', async (...args) => {
    const fetch = cachedFetch(...args);

    const res = await fetch('https://example.com');

    const ttl = 'ttl' in args[0] ? args[0].ttl : (args as { ttl: number }[])[1]!.ttl;
    expect(res.headers.get('Cache-Control')).toBe(`max-age: ${ttl}`);
  });

  it.each(params)('sets Cache-Control header if none', async (...args) => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      async () => new Response('', { headers: { 'Cache-Control': 'max-age: 1234' } }),
    );
    const fetch = cachedFetch(...args);

    const res = await fetch('https://example.com');

    const ttl = 'ttl' in args[0] ? args[0].ttl : (args as { ttl: number }[])[1]!.ttl;
    expect(res.headers.get('Cache-Control')).not.toBe(`max-age: ${ttl}`);
    expect(res.headers.get('Cache-Control')).toBe('max-age: 1234');
  });

  it.each(params)('caches each request with different headers', async (...args) => {
    const fetch = cachedFetch(...args);

    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response('1'));
    const first = await fetch('https://example.com', {
      headers: {
        'X-Foo': 'Bar',
      },
    });
    vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response('2'));
    const second = await fetch('https://example.com', {
      headers: {
        'X-Foo': 'Baz',
      },
    });

    const a = (cache.put as MockedFunction<(typeof Cache)['prototype']['put']>).mock
      .calls[0][0] as Request;
    const b = (cache.put as MockedFunction<(typeof Cache)['prototype']['put']>).mock
      .calls[1][0] as Request;
    expect(a.headers).not.toEqual(b.headers);
    expect(await first.text()).not.toEqual(await second.text());
  });

  it.each(params)('fires fetch when cache missed', async (...args) => {
    vi.spyOn(globalThis, 'fetch');
    const fetch = cachedFetch(...args);

    await fetch('https://example.com');

    expect(globalThis.fetch).toHaveBeenCalledWith(expect.any(Request));
    const req = (globalThis.fetch as MockedFunction<typeof fetch>).mock.calls[0][0] as Request;
    expect(req.url).toBe('https://example.com/');
  });
});
