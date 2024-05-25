import { type KVContext } from '@tier-revealer/adapters/cloudflare/kv/KVContext';
import putAuthChallenge from '@tier-revealer/adapters/cloudflare/kv/putAuthChallenge';
import putRiotTokens from '@tier-revealer/adapters/cloudflare/kv/putRiotTokens';
import getOauth2Tokens from '@tier-revealer/adapters/riot/api/getOauth2Tokens';
import { decodeJwt } from 'jose';
import createAuthChallenge from '../createAuthChallenge';

interface Params {
  code: string;
}

export default async function authenticate(
  {
    riotTokensNamespace,
    authChallengeNamespace,
  }: KVContext<'riotTokensNamespace' | 'authChallengeNamespace'>,
  { code }: Params,
) {
  const res = await getOauth2Tokens({ code });
  if (!res.ok) {
    return null;
  }

  const payload: {
    refresh_token: string;
    id_token: string;
    access_token: string;
  } = await res.json();
  const idToken = payload.id_token;
  const claims = decodeJwt(idToken);

  const challenge = createAuthChallenge();

  Promise.all([
    putRiotTokens({ namespace: riotTokensNamespace }, { payload }),
    putAuthChallenge(
      { namespace: authChallengeNamespace },
      {
        riotSub: claims.sub!,
        challenge,
      },
    ),
  ]);

  const exp = claims.exp!;
  const idTokenExpires = new Date(exp * 1000).toUTCString();

  return { idToken, idTokenExpires };
}
