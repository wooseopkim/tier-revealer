import { decodeJwt } from 'jose';
import { type KVContext } from './KVContext';

interface Params {
  payload: Record<'id_token' | 'refresh_token' | 'access_token', string>;
}

export default async function putRiotTokens({ namespace }: KVContext, { payload }: Params) {
  const { id_token: idToken } = payload;
  const claims = decodeJwt(idToken);
  await namespace.put(claims.sub!, JSON.stringify(payload), { expiration: claims.exp });
}
