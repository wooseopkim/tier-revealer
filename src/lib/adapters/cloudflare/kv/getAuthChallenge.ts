import getJwks from '$lib/adapters/riot/api/getJwks';
import isExpired from '$lib/jwt/isExpired';
import verifyWithJwks from '$lib/jwt/verifyWithJwks';
import type { KVNamespace } from '@cloudflare/workers-types/experimental';

interface Params {
  namespace: KVNamespace;
  riotIdToken: string;
}

export default async function getAuthChallenge({ namespace, riotIdToken }: Params) {
  const jwks = await getJwks();
  const { payload: claims } = await verifyWithJwks(riotIdToken, jwks);
  if (isExpired(claims)) {
    return null;
  }
  return await namespace.get(claims.sub!);
}
