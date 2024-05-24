interface CacheName {
  name: string;
}

interface CacheUrl {
  url: string;
}

interface CacheConfig {
  ttl: number;
}

export default function cachedFetch({ name }: CacheName, { ttl }: CacheConfig): typeof fetch;
export default function cachedFetch({ url, ttl }: CacheUrl & CacheConfig): typeof fetch;
export default function cachedFetch(
  x: CacheName | (CacheUrl & CacheConfig),
  y?: CacheConfig | undefined,
): typeof fetch {
  const name = 'name' in x ? x.name : x.url;
  const ttl = 'ttl' in x ? x.ttl : y!.ttl;

  const cachesPropertyUndefined = typeof caches === 'undefined';

  return async (input, init) => {
    const method = init?.method;
    const methodNotGet = typeof method !== 'undefined' && method !== 'GET';

    const noCache = methodNotGet || cachesPropertyUndefined;
    if (noCache) {
      return fetch(input, init);
    }

    const req = new Request(input, init);

    const cache = await caches.open(name);
    const cached = await cache.match(req);
    if (cached !== undefined) {
      return cached;
    }

    let res = await fetch(req);
    if (!res.ok) {
      return res;
    }

    if (!res.headers.has('Cache-Control')) {
      const headers = new Headers(res.headers);
      headers.set('Cache-Control', `max-age: ${ttl}`);
      res = new Response(res.body, {
        ...res,
        headers,
      });
    }

    await cache.put(req, res.clone());
    
    return res;
  };
}
