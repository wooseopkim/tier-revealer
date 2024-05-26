import type D1Context from '@tier-revealer/adapters/cloudflare/d1/D1Context';
import getAccountConnections from '@tier-revealer/adapters/cloudflare/d1/getAccountConnections';
import { type KVContext } from '@tier-revealer/adapters/cloudflare/kv/KVContext';
import getRiotTokens from '@tier-revealer/adapters/cloudflare/kv/getRiotTokens';
import getLeagueEntry from '@tier-revealer/adapters/riot/api/getLeagueEntry';
import getMyAccount from '@tier-revealer/adapters/riot/api/getMyAccount';
import getMySummoner from '@tier-revealer/adapters/riot/api/getMySummoner';
import type BaseError from '@tier-revealer/lib/models/BaseError';
import BaseHttpError from '@tier-revealer/lib/models/BaseHttpError';
import type Identity from '@tier-revealer/lib/models/riot/Identity';
import verifyToken from './verifyToken';

interface Context extends KVContext, D1Context {}

interface Params {
  riotIdToken: string;
}

export default async function getMe(context: Context, { riotIdToken }: Params) {
  const { payload: claims } = await verifyToken({ token: riotIdToken });
  const riotSub = claims.sub!;

  const tokens = await getRiotTokens(context, { riotSub });
  if (tokens === null) {
    return new TokensNotFoundError();
  }
  const { access_token: accessToken } = tokens;

  const responses = await Promise.all(
    [
      getMySummoner({ accessToken })
        .then((x) => x.json())
        .then(({ id: summonerId }) => getLeagueEntry({ summonerId })),
      getMyAccount({ accessToken }),
    ].map(async (x) => {
      const res = await x;
      if (res.status !== 200) {
        return ApiError.from(res);
      }
      return res.json();
    }),
  );

  const error: Error = responses.find((x) => x instanceof Error);
  if (error) {
    return error;
  }

  const [entries, account] = responses;

  const { gameName } = account;
  const leagueEntries = entries.map(({ tier, rank, queueType }: Record<string, string>) => ({
    tier,
    rank,
    queueType,
  }));
  const riotIdentity: Identity = {
    gameName,
    leagueEntries,
  };

  const { results: connections } = await getAccountConnections(context, { riotSub });

  return {
    riotIdentity,
    connections,
  };
}

class ApiError extends BaseHttpError {
  static async from(res: Response) {
    return await BaseHttpError.from(res, 'RIOT_API_ERROR');
  }
}

class TokensNotFoundError extends Error implements BaseError {
  code = 'TOKENS_NOT_FOUND';
  message = 'Riot tokens not found';
}
