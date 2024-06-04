import type D1Context from '@tier-revealer/adapters/cloudflare/d1/D1Context';
import getAccountConnections from '@tier-revealer/adapters/cloudflare/d1/getAccountConnections';
import type { KVContext } from '@tier-revealer/adapters/cloudflare/kv/KVContext';
import getRiotTokens from '@tier-revealer/adapters/cloudflare/kv/getRiotTokens';
import type BaseError from '@tier-revealer/lib/models/BaseError';
import updateMe from './updateMe';
import verifyToken from './verifyToken';

interface Context extends D1Context, KVContext {}

interface Params {
  idToken: string;
}

export default async function verifyAndUpdateMe(context: Context, { idToken }: Params) {
  const { payload: claims } = await verifyToken({ token: idToken });
  const puuid = claims.sub!;

  const payload = await getRiotTokens(context, { puuid });
  if (payload === null || payload instanceof Error) {
    return new TokensNotFoundError(payload);
  }
  const { access_token: accessToken } = payload;

  const me = await updateMe(context, { accessToken });
  if (me instanceof Error) {
    return me;
  }
  const { account, leagueEntries } = me;

  const connections = await getAccountConnections(context, { puuid });
  if (connections instanceof Error) {
    return connections;
  }

  return {
    account,
    leagueEntries,
    connections,
  };
}

class TokensNotFoundError extends Error implements BaseError {
  code = 'TOKENS_NOT_FOUND';
  message = 'Riot tokens not found';

  constructor(cause: Error | null) {
    super();
    if (cause) {
      this.message += `: ${cause.message}`;
    }
  }
}
