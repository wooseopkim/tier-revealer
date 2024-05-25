import type { JWTPayload } from 'jose';

export default function isExpired(claims: JWTPayload) {
  return new Date().valueOf() >= new Date(claims.exp! * 1000).valueOf();
}
