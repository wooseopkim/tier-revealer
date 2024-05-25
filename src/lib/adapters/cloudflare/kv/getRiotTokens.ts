import getJwks from '$lib/adapters/riot/api/getJwks';
import isExpired from '$lib/jwt/isExpired';
import verifyWithJwks from '$lib/jwt/verifyWithJwks';
import type { KVNamespace } from '@cloudflare/workers-types/experimental';

interface Params {
  namespace: KVNamespace;
  idToken: string;
}

export default async function getRiotTokens({ namespace, idToken }: Params) {
  const jwks = await getJwks();
  const { payload: claims } = await verifyWithJwks(idToken, jwks);
  if (isExpired(claims)) {
    return null;
  }
  return await namespace.get(claims.sub!);
}
