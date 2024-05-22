import type { KVNamespace } from '@cloudflare/workers-types/experimental';
import { decodeProtectedHeader, importJWK, jwtVerify, type JWK } from 'jose';

interface Params {
  namespace: KVNamespace;
  idToken: string;
}

export default async function getRiotTokens({ namespace, idToken }: Params) {
  const res = await fetch('https://auth.riotgames.com/jwks.json');
  const { keys: jwks }: { keys:JWK[] } = await res.json();
  const { kid } = decodeProtectedHeader(idToken);
  const jwk = jwks.find((jwk) => jwk.kid === kid)!;
  const key = await importJWK(jwk, jwk.alg)
  const { payload: claims } = await jwtVerify(idToken, key);
  if (new Date().valueOf() >= new Date(claims.exp! * 1000).valueOf()) {
    return null;
  }
  return await namespace.get(claims.sub!);
}
