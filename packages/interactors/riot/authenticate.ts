import type D1Context from '@tier-revealer/adapters/cloudflare/d1/D1Context';
import { type KVContext } from '@tier-revealer/adapters/cloudflare/kv/KVContext';
import putAuthChallenge from '@tier-revealer/adapters/cloudflare/kv/putAuthChallenge';
import putRiotTokens from '@tier-revealer/adapters/cloudflare/kv/putRiotTokens';
import getOauth2Tokens from '@tier-revealer/adapters/riot/api/getOauth2Tokens';
import BaseHttpError from '@tier-revealer/lib/models/BaseHttpError';
import { decodeJwt } from 'jose';
import createAuthChallenge from '../createAuthChallenge';
import updateMe from './updateMe';

interface Context extends KVContext<'riotTokensNamespace' | 'authChallengeNamespace'>, D1Context {}

interface Params {
  code: string;
}

export default async function authenticate(context: Context, { code }: Params) {
  const { riotTokensNamespace, authChallengeNamespace } = context;

  const tokensResponse = await getOauth2Tokens({ code });
  if (!tokensResponse.ok) {
    return Oauth2TokensError.from(tokensResponse);
  }

  const payload: {
    refresh_token: string;
    id_token: string;
    access_token: string;
  } = await tokensResponse.json();
  const idToken = payload.id_token;
  const claims = decodeJwt(idToken);

  const challenge = createAuthChallenge();

  const riotSub = claims.sub!;
  const results = await Promise.all([
    updateMe(context, { accessToken: payload.access_token }),
    putRiotTokens({ namespace: riotTokensNamespace }, { payload }),
    putAuthChallenge({ namespace: authChallengeNamespace }, { riotSub, challenge }),
  ]);

  const error = results.find((x) => x instanceof Error);
  if (error instanceof Error) {
    return error;
  }

  const exp = claims.exp!;
  const idTokenExpires = new Date(exp * 1000).toUTCString();

  return { idToken, idTokenExpires };
}

class Oauth2TokensError extends BaseHttpError {
  static async from(res: Response) {
    return await BaseHttpError.from(res, 'OAUTH2_TOKENS_ERROR');
  }
}
