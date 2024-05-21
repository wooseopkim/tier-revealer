import type { KVNamespace } from '@cloudflare/workers-types/experimental';
import { decodeJwt } from 'jose';

interface Params {
  namespace: KVNamespace;
  idToken: string;
}

export default async function getRiotTokens({ namespace, idToken }: Params) {
  const claims = decodeJwt(idToken);
  return await namespace.get(claims.sub!);
}
