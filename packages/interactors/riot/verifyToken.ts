import cachedFetch from '@tier-revealer/lib/cache/cachedFetch';
import verifyWithJwks from '@tier-revealer/lib/jwt/verifyWithJwks';
import { type JWK } from 'jose';

interface Params {
  token: string;
}

export default async function verifyToken({ token }: Params) {
  const fetch = cachedFetch(verifyToken, { ttl: 300 });
  const res = await fetch('https://auth.riotgames.com/jwks.json');
  const { keys: jwks }: { keys: JWK[] } = await res.json();
  const result = await verifyWithJwks(token, jwks);
  return result;
}
