import { decodeProtectedHeader, importJWK, jwtVerify, type JWK } from 'jose';

export default async function verifyWithJwks(token: string, jwks: JWK[]) {
  const { alg, kid } = decodeProtectedHeader(token);
  const jwk = jwks.find((jwk) => jwk.kid === kid)!;
  const key = await importJWK(jwk, jwk.alg ?? alg);
  return await jwtVerify(token, key);
}
