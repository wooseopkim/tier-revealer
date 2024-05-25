import type { KVNamespace } from '@cloudflare/workers-types/experimental';
import { decodeJwt } from 'jose';

interface Params {
  namespace: KVNamespace;
  riotIdToken: string;
  challenge: string;
}

export default async function putAuthChallenge({ namespace, riotIdToken, challenge }: Params) {
  const claims = decodeJwt(riotIdToken);
  await namespace.put(claims.sub!, challenge, { expirationTtl: 120 });
}
