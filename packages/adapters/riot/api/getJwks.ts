import cachedFetch from '@tier-revealer/lib/cache/cachedFetch';
import type { JWK } from 'jose';

export default async function getJwks() {
  const fetch = cachedFetch(getJwks, { ttl: 300 });
  const res = await fetch('https://auth.riotgames.com/jwks.json');
  const { keys: jwks }: { keys: JWK[] } = await res.json();
  return jwks;
}
