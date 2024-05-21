import type { KVNamespace } from '@cloudflare/workers-types/experimental';
import { decodeJwt } from 'jose';

interface Params {
  namespace: KVNamespace;
  payload: Record<'id_token' | 'refresh_token' | 'access_token', string>;
}

export default async function putRiotTokens({ namespace, payload }: Params) {
  const { id_token: idToken } = payload;
  const claims = decodeJwt(idToken);
  await namespace.put(claims.sub!, JSON.stringify(payload));
}
